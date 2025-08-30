import fetch from 'cross-fetch';
import { Dispatch } from 'redux';
import {
  get_endpoint,
  get_origin_ending_fixed,
  get_query_starting_fixed,
  get_themed_state,
  get_val,
  is_object
} from '../business.logic';
import {
  remember_error,
  remember_exception,
  remember_jsonapi_errors
} from '../business.logic/errors';
import net_default_200_driver from './net.default.200.driver.c';
import net_default_201_driver from './net.default.201.driver.c';
import net_default_400_driver from './net.default.400.driver.c';
import net_default_401_driver from './net.default.401.driver.c';
import net_default_404_driver from './net.default.404.driver.c';
import net_default_409_driver from './net.default.409.driver.c';
import net_default_500_driver from './net.default.500.driver.c';
import {
  appHideSpinner, appRequestFailed, appRequestStart
} from '../slices/app.slice';
import { IRedux, RootState } from '.';
import { IJsonapiBaseResponse, IJsonapiError } from '../interfaces/IJsonapi';
import { cancel_spinner, schedule_spinner } from './spinner';
import IStateDialog from '../interfaces/IStateDialog';
import StateNet from '../controllers/StateNet';
import { TThemeMode } from '../interfaces';
import Config from '../config';
import { THEME_DEFAULT_MODE, THEME_MODE } from '../constants.client';
import { net_patch_state } from './actions';
import { ler, pre } from '../business.logic/logging';
import {
  e_missingDialogDarkState,
  e_MissingDialogKey,
  e_missingDialogLightState,
  e_missingDialogState
} from '../business.logic/dev.errors.jsonapi';
import { StateRegistry } from '../controllers/StateRegistry';

const DEFAULT_HEADERS: RequestInit['headers'] = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options
 */
const DEFAULT_POST_PAYLOAD: RequestInit = {
  method: 'post',
  headers: DEFAULT_HEADERS,
  body: {} as RequestInit['body']
};

const DEFAULT_PUT_PAYLOAD: RequestInit = {
  method: 'put',
  headers: DEFAULT_HEADERS,
  body: {} as RequestInit['body']
};

const DEFAULT_GET_PAYLOAD: RequestInit = {
  method: 'get',
  headers: DEFAULT_HEADERS
};

const DEFAULT_DELETE_PAYLOAD: RequestInit = {
  method: 'delete',
  headers: DEFAULT_HEADERS
};

/**
 * Handles errors.
 *
 * This is the one stop for error generated here, client side, based on the 
 * browser's interpretation of the response.
 * __Note__: The errors handled here are different from those generated
 * server-side. These would typically be considered a valid response and would
 * be handled by another function (delegateDataHandling).
 */
const delegate_error_handling = (dispatch: Dispatch) => {
  cancel_spinner();
  dispatch(appHideSpinner());
  dispatch(appRequestFailed());
};

/**
 * Handles (arguebly) successful responses.
 */
const delegate_data_handling = (
  dispatch: Dispatch,
  getState: () => RootState,
  endpoint: string,
  json: IJsonapiBaseResponse
) => {
  const status = json.meta?.status as number || 500;
  const defaultDriver: { [key: number]: () => void } = {
    200: () => net_default_200_driver(dispatch, getState, endpoint, json),
    201: () => net_default_201_driver(dispatch, getState, endpoint, json),
    400: () => net_default_400_driver(dispatch, getState, endpoint, json),
    401: () => net_default_401_driver(dispatch, getState, endpoint, json),
    404: () => net_default_404_driver(dispatch, getState, endpoint, json),
    409: () => net_default_409_driver(dispatch, getState, endpoint, json),
    500: () => net_default_500_driver(dispatch, getState, endpoint, json),
  }
  // Handle the JSON response here.
  try {
    switch (json.driver) {

      // TODO Define custom ways of handling the response here.

      default:
        defaultDriver[status]();
    }
  } catch (e) {
    remember_exception(e);
  }
  cancel_spinner();
  dispatch(appHideSpinner());
}

/**
 * TODO Implement this function.
 * This function is for handling unexpected nesting.
 * It's a common problem when the server returns a response that is
 * not in the expected format.  
 * For example, the server returns a response like this:  
 * ```json
 * {
 *   "data": {
 *     "id": "123",
 *     "type": "users",
 *     "attributes": {
 *       "name": "John Doe"
 *     }
 *   }
 * }
 * ```
 * But the client expects a response like this:
 * ```json
 * {
 *   "id": "123",
 *   "type": "users",
 *   "attributes": {
 *     "name": "John Doe"
 *   }
 * }
 * ```
 * This function should be able to handle this problem.
 * It should be able to detect the unexpected nesting and fix it.
 * It should also be able to detect the expected nesting and leave it
 * alone.
 * This function should be able to handle the following cases:
 * 1. The server returns a response with the expected nesting.  
 * 2. The server returns a response with the unexpected nesting.  
 * 3. The server returns a response with the expected nesting and
 *   unexpected nesting.
 *
 * As more cases are discovered, they should be added to this list.
 */
function _resolve_unexpected_nesting<T=unknown>(response: unknown): T {
  if (is_object(response) && 'response' in response) {// Case of nested response
    return response.response as T;
  }

  // ... other cases

  return response as T;
}

/**
 * Get dialog state from the server.
 *
 * @param redux store, actions, etc.
 * @param registryKey
 * @returns dialog state
 */
export async function get_dialog_state <T=unknown>(
  redux: IRedux,
  registryKey: string
): Promise<IStateDialog<T>|null> {
  pre('get_dialog_state():');
  const rootState = redux.store.getState();
  const stateRegistry = rootState.stateRegistry;
  const dialogKey = new StateRegistry(stateRegistry).get(registryKey);
  if (typeof dialogKey !== 'string') {
    e_MissingDialogKey(registryKey);
    return null;
  }
  const mode = Config.read<TThemeMode>(THEME_MODE, THEME_DEFAULT_MODE);
  const dialogActiveState = rootState.dialogs[dialogKey];
  const dialogLightState = rootState.dialogsLight[dialogKey];
  const dialogDarkState = rootState.dialogsDark[dialogKey];
  if (!dialogLightState || !dialogDarkState) {
    ler(`get_dialog_state: ${dialogKey} missing light or/and dark theme(s).`);
    remember_error({
      code: 'not_found',
      title: `${dialogKey} Not Found`,
      detail: `${dialogKey} missing light or/and dark theme(s).`,
      source: { pointer: dialogKey }
    });
  }
  const dialogState = get_themed_state<IStateDialog<T>>(
    mode,
    dialogActiveState,
    dialogLightState,
    dialogDarkState
  );
  if (dialogState) { return dialogState; }
  const origin = get_origin_ending_fixed(rootState.app.origin);
  const dialogPathname = rootState.pathnames.dialogs;
  const url = `${origin}${dialogPathname}`;
  const { headers } = new StateNet(rootState.net);
  const response = await post_fetch(url, {
    'key': dialogKey,
    'mode': mode
  }, headers);
  const errors = get_val<IJsonapiError[]>(response, 'errors');
  if (errors) {
    ler(`get_dialog_state: ${errors[0].title}`);
    remember_jsonapi_errors(errors);
    return null;
  }
  const main = get_val(response, `state.dialogs.${dialogKey}`);
  const light = get_val(response, `state.dialogsLight.${dialogKey}`);
  const dark = get_val(response, `state.dialogsDark.${dialogKey}`);
  !main && e_missingDialogState(dialogKey);
  !light && e_missingDialogLightState(dialogKey);
  !dark && e_missingDialogDarkState(dialogKey);
  const themedDialogState = get_themed_state<IStateDialog<T>>(
    mode,
    main,
    light,
    dark
  );
  if (themedDialogState._key !== dialogKey) {
    ler(`get_dialog_state: ${dialogKey} does not match ${themedDialogState._key}.`);
    remember_error({
      code: 'not_found',
      title: `${dialogKey} Not Found`,
      detail: `${dialogKey} does not match ${themedDialogState._key}.`,
      source: { pointer: dialogKey }
    });
    return null;
  }

  const state = get_val(response, 'state');
  if (state) {
    redux.store.dispatch(net_patch_state(state));
  }

  return themedDialogState;
} // END - get_dialog_state

export async function post_fetch<T=unknown>(
  url: string,
  body: T,
  customHeaders?: RequestInit['headers']
): Promise<unknown> {
  const headers = {
    ...DEFAULT_POST_PAYLOAD,
    headers: {
      ...DEFAULT_POST_PAYLOAD.headers,
      ...customHeaders
    }
  };
  const response = await fetch(url, {
    ...headers,
    body: JSON.stringify(body)
  });
  const json = await response.json();
  return json;
}

export async function get_fetch<T=unknown>(url: string): Promise<T> {
  const response = await fetch(url, DEFAULT_GET_PAYLOAD);
  const json = await response.json();
  return json as T;
}

/**
 * Use this function make a POST request.
 *
 * [TODO] Implement the PUT request version of this function. Or just fully
 *        implement all HTTP verbs. PATCH, DELETE, OPTIONS, HEAD.
 *
 * @param endpoint usually an entity name. Otherwise, it's a valid URI endpoint.
 *                 e.g. `users`
 * @param args the data you want to send to the server. e.g. form data.
 */
export const post_req_state = (
  endpoint: string,
  body: unknown,
  customHeaders?: RequestInit['headers']
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(appRequestStart());
    schedule_spinner();
    try {
      const rootState = getState();
      const origin = get_origin_ending_fixed(rootState.app.origin);
      const url = `${origin}${endpoint}`;
      const { headers: netHeaders } = new StateNet(rootState.net);
      const headers = { ...netHeaders, ...customHeaders };
      const response = await fetch(url, {
        ...DEFAULT_POST_PAYLOAD,
        headers: {
          ...DEFAULT_POST_PAYLOAD.headers,
          ...headers
        },
        body: JSON.stringify(body)
      });
      const json = _resolve_unexpected_nesting<IJsonapiBaseResponse>(
        await response.json()
      );
      json.meta = json.meta ?? {};
      json.meta.status = response.status;
      json.meta.statusText = response.statusText;
      json.meta.ok = response.ok
      delegate_data_handling(dispatch, getState, endpoint, json);
    } catch (error: unknown) {
      remember_exception(error);
      delegate_error_handling(dispatch);
    }
  }
};

export const put_req_state = (
  endpoint: string,
  body?: unknown,
  customHeaders?: RequestInit['headers']
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(appRequestStart());
    schedule_spinner();
    try {
      const rootState = getState();
      const origin = get_origin_ending_fixed(rootState.app.origin);
      const url = `${origin}${endpoint}`;
      const headersDef = new StateNet(rootState.net).headers;
      const headers = { ...headersDef, ...customHeaders };
      const response = await fetch(url, {
        ...DEFAULT_PUT_PAYLOAD,
        headers: {
          ...DEFAULT_PUT_PAYLOAD.headers,
          ...headers
        },
        body: JSON.stringify(body)
      });
      const json = await response.json();
      json.meta = json.meta || {};
      json.meta.status = response.status;
      json.meta.statusText = response.statusText;
      json.meta.ok = response.ok;
      delegate_data_handling(dispatch, getState, endpoint, json);
    } catch (error: unknown) {
      remember_exception(error);
      delegate_error_handling(dispatch);
    }
  }
};

export const axios_post_req_state = (
  _endpoint: string,
  _body?: unknown,
  _headers?: RequestInit['headers']
) => {
  // [TODO] Implement this function using axios.
  //        Install axios first: `yarn add axios`
  //        Then, import it: `import axios from 'axios'`
  //        Then, use it: `axios.post(url, body, headers)`
};

/**
 * Makes a `GET` request to an endpoint to retrieve a collection
 *
 * @param endpoint usually an entity name. Otherwise, it's a valid URI endpoint.
 *                 e.g. `users`
 * @param args URL query strings e.g. '?id=123'
 *             It must be a valid query string therefore, the interrogation
 *             point is required.
 */
export const get_req_state = (
  endpoint: string,
  args = '',
  customHeaders?: RequestInit['headers']
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(appRequestStart());
    schedule_spinner();
    try {
      const rootState  = getState();
      const origin = get_origin_ending_fixed(rootState.app.origin);
      const query  = get_query_starting_fixed(args);
      const uri = `${origin}${endpoint}${query}`;
      const headersDef = new StateNet(rootState.net).headers;
      const headers = { ...headersDef, ...customHeaders };
      const response = await fetch(uri, {
        ...DEFAULT_GET_PAYLOAD,
        headers: {
          ...DEFAULT_GET_PAYLOAD.headers,
          ...headers
        }
      });
      const json = await response.json();
      json.meta = json.meta || {};
      json.meta.status = response.status;
      json.meta.statusText = response.statusText;
      json.meta.ok = response.ok;
      delegate_data_handling(dispatch, getState, endpoint, json);
    } catch (error) {
      remember_exception(error);
      delegate_error_handling(dispatch);
    }
  }
};

export const delete_req_state = (
  endpoint: string,
  args = '',
  customHeaders?: RequestInit['headers']
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(appRequestStart());
    schedule_spinner();
    try {
      const rootState = getState();
      const origin = get_origin_ending_fixed(rootState.app.origin);
      const query  = get_query_starting_fixed(args);
      const uri = `${origin}${endpoint}${query}`;
      const headersDef = new StateNet(rootState.net).headers;
      const headers = { ...headersDef, ...customHeaders };
      const response = await fetch(uri, {
        ...DEFAULT_DELETE_PAYLOAD,
        headers: {
          ...DEFAULT_DELETE_PAYLOAD.headers,
          ...headers
        }
      });
      const json = await response.json();
      json.meta = json.meta || {};
      json.meta.status = response.status;
      json.meta.statusText = response.statusText;
      json.meta.ok = response.ok;
      delegate_data_handling(dispatch, getState, endpoint, json);
    } catch (error) {
      remember_exception(error);
      delegate_error_handling(dispatch);
    }
  }
};

/**
 * Makes a `POST` request to server and handle the response yourself.
 *
 * @param pathname Slash-separated URL params only e.g. `param1/param2/`
 * @param body Data (an object) to be sent to server
 * @param success callback to receive a legitimate server response if there is
 *                one.
 * @param failure callback for a failed request with no proper server response.
 */
export const post_req = async (
  pathname: string,
  body: unknown,
  success?: (state: unknown, endpoint: string) => void,
  failure?: (error: unknown) => void
) => {
  const endpoint = get_endpoint(pathname);
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(appRequestStart());
    schedule_spinner();
    try {
      const rootState = getState();
      const originEndingFixed = get_origin_ending_fixed(rootState.app.origin);
      const url = `${originEndingFixed}${pathname}`;
      const response = await fetch( url,{
        ...DEFAULT_POST_PAYLOAD,
        headers: {
          ...DEFAULT_POST_PAYLOAD.headers,
          ...new StateNet(rootState.net).headers
        },
        body: JSON.stringify(body)
      } as RequestInit);
      const json = await response.json();
      success
      ? success(json, endpoint)
      : delegate_data_handling(dispatch, getState, endpoint, json);
    } catch (error) {
      remember_exception(error);
      failure ? failure(error) : delegate_error_handling(dispatch);
    }
  }
};

/**
 * Makes a `GET` request to server by providing your own callbacks to handle
 * the response.
 *
 * @param pathname   Slash-separated URL params only e.g. `param1/param2/`
 * @param success callback to receive a legitimate server response if there is
 *                one.
 * @param failure callback for a failed request with no proper server response.
 */
export const get_req = (
  pathname: string,
  success?: (endpoint: string, state: unknown) => void,
  failure?: (error: unknown) => void
) => {
  const endpoint = get_endpoint(pathname);
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(appRequestStart());
    schedule_spinner();
    try {
      const rootState = getState();
      const originEndingFixed = get_origin_ending_fixed(rootState.app.origin);
      const url = `${originEndingFixed}${pathname}`;
      const response = await fetch(url, {
        ...DEFAULT_GET_PAYLOAD,
        headers: {
          ...DEFAULT_GET_PAYLOAD.headers,
          ...new StateNet(rootState.net).headers
        }
      });
      const json = await response.json();
      success
      ? success(endpoint, json)
      : delegate_data_handling(dispatch, getState, endpoint, json);
    } catch (error) {
      remember_exception(error);
      failure ? failure(error) : delegate_error_handling(dispatch);
    }
  };
};
