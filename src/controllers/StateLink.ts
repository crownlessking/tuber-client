import { default_callback, TReduxHandle } from 'src/state';
import AbstractState from './AbstractState';
import IStateFormItemCustom from '../interfaces/IStateFormItemCustom';
import IStateLink from '../interfaces/IStateLink';
import StateFormItemCustom from './StateFormItemCustom';

export default class StateLink<P = any>
  extends AbstractState
  implements IStateLink
{
  private _linkState: IStateLink;
  private _parentDef: P;
  private _linkHasState: IStateFormItemCustom;
  private _linkHas?: StateFormItemCustom<this>;
  private _handleOnClick?: TReduxHandle;

  constructor (linkState: IStateLink, parent?: P) {
    super();
    this._linkState = linkState;
    this._parentDef = parent || ({
      menuItemsProps: {},
      menuItemsSx: {},
      typography: {}
    }) as any;
    this._linkHasState = this._linkState.has || { };
  }

  get state(): IStateLink { return this._linkState; }
  get parent(): P { return this._parentDef; }
  get props(): any { return this._linkState.props; }
  get theme(): any { return this.die('Not implemented yet.', {}); }
  get type(): Required<IStateLink>['type'] { return this._linkState.type || 'text'; }
  get has(): StateFormItemCustom<this> {
    return this._linkHas
      || (this._linkHas = new StateFormItemCustom(
        this._linkHasState, this
      ));
  }
  private setHandleOnClick = (): TReduxHandle => {
    if (this._linkState.onClick) {
      return this._handleOnClick = this._linkState.onClick;
    }
    if (this._linkHas) {
      const handleCallback = this._linkHas.getHandleCallback();
      if (handleCallback) {
        return this._handleOnClick = handleCallback;
      }
    }
    return this._handleOnClick = default_callback;
  }

  get onClick(): TReduxHandle {
    return this._handleOnClick || this.setHandleOnClick();
  }
  get href(): string { return this._linkState.href ?? ''; }
  get color(): string { return this._linkHasState.color || 'inherit'; }

  /** Set form field `onClick` attribute */
  set onClick(cb: TReduxHandle) {
    this._handleOnClick = cb;
  }
}

/**
 * Format routes
 *
 * **dev**
 * This function was created because I did not want to be force to include
 * the starting forwardslash in the route when defining buttons and links.
 * I believe it is much cleaner (in terms of naming convension) to keep the
 * forwardslash out of the definition.
 * Although an entire function is not necessary but you never know, the
 * route formatting process might grow in complexity in the furture.
 *
 * @todo This function could be moved to `links.controller.ts` file once it is
 *       created OR if there is a need to create it.
 *
 * @param route
 */
export function get_formatted_route(has: StateFormItemCustom<any>, href?: string): string {
  const route = has.route;
  if (route) {
    return route.charAt(0) !== '/' ? `/${route}` : route;
  }
  const {pathname, search } = window.location;
  return href || pathname + (search ?? '');
}