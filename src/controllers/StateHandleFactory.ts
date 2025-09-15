import { post_fetch, post_req_state } from '../state/net.actions';
import store, { actions, TReduxHandle } from '../state';
import JsonapiRequest from '../business.logic/JsonapiRequest';
import FormValidationPolicy from '../business.logic/FormValidationPolicy';
import { ler, pre } from '../business.logic/logging';
import { THEME_DEFAULT_MODE, THEME_MODE } from '../constants.client';
import {
  INetState,
  IStateKeys,
  TStatePathnames
} from '../interfaces/IState';
import { get_origin_ending_fixed, get_val } from '../business.logic';
import StateNet from './StateNet';
import Config from '../config';
import { TThemeMode } from '../common.types';
import { IJsonapiError } from '../interfaces/IJsonapi';
import { net_patch_state } from '../state/actions';
import { remember_jsonapi_errors } from '../business.logic/errors';
import {
  IHandleDirective,
  THandleDirectiveType
} from '../interfaces/IStateFormItemCustom';

/**
 * Utility function to parse old string directive format to new object format
 * @param directive - Old string format: "$<directive> : <formName> : <endpoint> : <route>"
 * @returns IDirective object
 */
export function parseStringDirective(directive: string): IHandleDirective {
  const parts = directive.split(':').map(part => part.trim());
  
  return {
    type: (parts[0] || '$none') as THandleDirectiveType,
    formName: parts[1] || undefined,
    endpoint: parts[2] || undefined,
    route: parts[3] || undefined,
  };
}

/**
 * Provides a default callback for buttons, links, ...etc, in case they need one.
 */
export default class StateHandleFactory {
  private _redux = {
    store,
    actions,
    route: this._directive.route
  };
  private _pathnames: TStatePathnames;
  private _headers?: Record<string, string>;
  private _origin: string;
  private _mode: TThemeMode;

  constructor (private _directive: IHandleDirective) {
    const rootState = store.getState();
    this._pathnames = rootState.pathnames as TStatePathnames;
    this._headers = new StateNet(rootState.net).headers;
    this._origin = get_origin_ending_fixed(rootState.app.origin);
    this._mode = Config.read<TThemeMode>(THEME_MODE, THEME_DEFAULT_MODE);
    pre(`[class] StateHandleFactory:`);
  }

  /**
   * Indicates whether the state fragment has already been retrieved from
   * server.
   */
  private _isAlreadyLoaded(stateName: string, key: string) {
    const registry = store.getState().dynamicRegistry;
    return typeof registry[`${stateName}.${key}`] === 'number';
  }

  /** Loads a single state fragment */
  private async _loadSingleStateFragment(
    stateName: IStateKeys,
    key: string
  ): Promise<INetState | undefined> {
    if (this._isAlreadyLoaded(stateName, key)) {
      return undefined;
    }
    const pathname = this._pathnames[stateName];
    const url = `${this._origin}${pathname}`;
    const response = await post_fetch(url, {
      key,
      'mode': this._mode
    }, this._headers);
    const errors = get_val<IJsonapiError[]>(response, 'errors');
    if (errors) {
      ler(`_loadSingleStateFragment(): ${errors[0].title}`);
      remember_jsonapi_errors(errors);
      return;
    }
    const stateFragment = get_val<INetState>(response, 'state');
    if (!stateFragment) { return undefined; }
    store.dispatch(net_patch_state(stateFragment));
    // Register state fragment as already loaded.
    store.dispatch(actions.dynamicRegistryAdd({
      prop: `${stateName}.${key}`,
      value: Date.now
    }));
    return stateFragment;
  }

  /** Loads multiple state fragments */
  private async _loadMultipleStateFragments(stateName: IStateKeys, keyList: string[]): Promise<INetState[]> {
    const pathname = this._pathnames[stateName];
    const url = `${this._origin}${pathname}`;
     // [TODO] Upgrade the server so it can handle an array of keys as request.
    const statePromises = keyList.map(async key => {
      if (this._isAlreadyLoaded(stateName, key)) {
        return undefined;
      }
      const response = await post_fetch(url, {
        key,
        'mode': this._mode
      }, this._headers);
      const errors = get_val<IJsonapiError[]>(response, 'errors');
      if (errors) {
        ler(`_performArrayDetail(): ${errors[0].title}`);
        remember_jsonapi_errors(errors);
        return undefined;
      }
      const state = get_val<INetState>(response, 'state');
      if (state) {
        store.dispatch(net_patch_state(state));
        // Register state fragment as already loaded.
        store.dispatch(actions.dynamicRegistryAdd({
          prop: `${stateName}.${key}`,
          value: Date.now
        }));
      }
      return state;
    });
    
    const states = await Promise.all(statePromises);
    const validStates = states.filter((state): state is INetState => state !== undefined);
    return validStates;
  }

  /** Loads the required states from server */
  private async _performLoadingTask() {
    const loadDetail = this._directive.load;
    if (!loadDetail) { return; }
    Object.entries(loadDetail).forEach(async detail => {
      const [stateName, stateId ] = detail;
      switch (typeof stateId) {
        case 'string':
          await this._loadSingleStateFragment(stateName as IStateKeys, stateId);
          break;
        case 'object':
          await this._loadMultipleStateFragments(stateName as IStateKeys, stateId);
          break;
        default:
          ler('_performLoadingTask(): State load id type invalid');
      }
    });
  }

  /** Submits form data using the directive configuration */
  private async _submitFormData(): Promise<void> {
    if (!this._directive.formName || !this._directive.endpoint) {
      ler('_submitFormData(): Missing required formName or endpoint from directive');
      return;
    }
    await this._performLoadingTask();
    const policy = new FormValidationPolicy(this._redux, this._directive.formName);
    const validationErrors = policy.applyValidationSchemes();
    if (validationErrors && validationErrors?.length > 0) {
      validationErrors.forEach(vError => {
        const message = vError.message ?? '';
        policy.emit(vError.name, message);
      });
      return;
    }
    const formData = policy.getFilteredData();
    const { dispatch } = store;
    const requestBody = new JsonapiRequest(this._directive.endpoint, formData).build();
    dispatch(post_req_state(this._directive.endpoint, requestBody));
    dispatch(actions.formsDataClear(this._directive.formName));
    if (this._directive.type === '$form_dialog') {
      dispatch(actions.dialogClose());
    }
  }

  private async _filterResourcesList() {
    // [TODO] Implement filtering resources data.
  }

  getDirectiveCallback(): TReduxHandle | undefined {
    switch (this._directive.type) {
      case '$form':
      case '$form_dialog':
        return () => () => { this._submitFormData(); };
      case '$filter':
        return () => () => { this._filterResourcesList(); };
      default:
        ler(`getDefaultCallback(): Invalid directive type: ${this._directive.type}`);
        return undefined;
    }
  }

}