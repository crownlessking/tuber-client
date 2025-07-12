import { get_val, safely_get } from '.';
import { get_head_meta_content } from '../business.logic';
import AbstractState from './AbstractState';
import IStateNet from '../interfaces/IStateNet';
import { remember_possible_error } from 'src/business.logic/errors';
import { err } from '../business.logic/logging';

export default class StateNet extends AbstractState implements IStateNet {

  private _netCsrfToken?: string;
  private _netHeaders?: Record<string, string>;
  private _token?: string;

  constructor(private _netState: IStateNet) {
    super();
  }

  get state(): IStateNet { return this._netState; }
  get parent(): any { return this.die('Not implemented yet.', {}); }
  get props(): any { return this.die('Not implemented yet.', {}); }
  get theme(): any { return this.die('Not implemented yet.', {}); }
  get csrfTokenName(): string { return this._netState.csrfTokenName ?? ''; }
  get csrfTokenMethod(): Required<IStateNet>['csrfTokenMethod'] {
    return this._netState.csrfTokenMethod || 'meta';
  }

  /** Attempts to locate the CSRF token. */
  private locateCsrfToken = (): string => {
    let token = '';
    switch (this.csrfTokenMethod) {
    case 'meta':
      token = get_head_meta_content(this.csrfTokenName);
      if (!token) err('Invalid meta: CSRF token not found.');
      break;
    case 'javascript':
      token = safely_get(window, this.csrfTokenName, '');
      if (!token) err('Invalid property (path): CSRF token not found.');
      break;
    }
    return token;
  };

  private _getTokenFromCookie(): string {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name.trim() === 'token') {
        return value.trim();
      }
    }
    return this._netState.token ?? '';
  }

  get token(): string {
    return this._token 
      ?? (this._token = this._netState.token
        ?? this._getTokenFromCookie()
      );
  }

  get csrfToken(): string {
    return this._netCsrfToken = this._netCsrfToken || (
      this._netCsrfToken = this.locateCsrfToken()
    );
  }

  /** Helper function for `get headers()`.  */
  private parseHeadersConeExp(): IStateNet['headers'] {
    if (this._netState.headers) {
      const netHeaders: IStateNet['headers'] = {};
      for (const p in this._netState.headers) {
        netHeaders[p] = parse_cone_exp(this, this._netState.headers[p]);
      }
      return netHeaders;
    }
    return {};
  }

  get headers(): IStateNet['headers'] {
    return this._netHeaders || (
      this._netHeaders = {
        ...(this.token ? {'Authorization':`Bearer ${this.token}`} : {}),
        ...this.parseHeadersConeExp()
      }
    );
  }

  setHeader(prop: string, value: string): void {
    const parsedValue = parse_cone_exp(this, value);
    this._netHeaders = this._netHeaders || {};
    this._netHeaders[prop] = parsedValue;
  }

  get jwt_version(): number { return this._netState.jwt_version ?? 0; }
  get name(): string { return this._netState.name ?? ''; }
  get role(): string { return this._netState.role ?? ''; }
  get restrictions(): string[] { return this._netState.restrictions || []; }
  /**
   * Run this function to log out.
   * @see https://www.tutorialspoint.com/How-to-clear-all-cookies-with-JavaScript
   */
  deleteCookie(): void {
    const cookies = document.cookie.split(';');
    // set 1 Jan, 1970 expiry for every cookies
    for (let i = 0; i < cookies.length; i++) {
      const [ name ] = cookies[i].trim().split('=') || [];
      if (name === 'mode') {
        continue;
      }
      document.cookie = `${cookies[i]}=;expires=${new Date(0).toUTCString()}`;
    }
  }
  get sessionValid(): boolean {
    if (this._netState.role
      && this._netState.name
    ) {
      return true;
    }
    remember_possible_error(`Invalid session`, this._netState);
    return false;
  }

  /**
   * Prevents some bugs by checking if the user is logged in.
   */
  get userLoggedIn(): boolean {
    return !!this._netState.name
      && !!this._netState.role
      && !!this.token
      && typeof this.jwt_version !== 'undefined';
  }
}

/**
 * Parses a cone expression.
 *
 * e.g. "<appInfo.origin>"
 *
 * Use a cone expression to give a property the value of another property. e.g.
 *
 * ```ts
 * const appNet = {
 *   headers: {
 *     origin: '<appInfo.origin>'
 *   }
 * };
 * ```
 *
 * `appNet.headers.origin` now as the value of `appInfo.origin`
 *
 * @param state that supports cone expressions
 * @param cone  the cone expression
 * @returns 
 */
export function parse_cone_exp(state: AbstractState, cone: string): string {
  if (/^<([-$_a-zA-Z0-9\\/]+)(\.[-$_a-zA-Z0-9\\/]+)*>$/.test(cone)) {
    const value = get_val(state, cone.substring(1, cone.length - 1));
    if (!value) {
      err(`Cone expression resolution on '${cone}' failed.`);
    }
    return value;
  }
  return cone;
}