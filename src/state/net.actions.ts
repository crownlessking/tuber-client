import fetch from 'cross-fetch';
import { Dispatch } from 'redux';
import {
  get_endpoint,
  get_origin_ending_fixed,
  get_query_starting_fixed,
  get_themed_state
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
import { IJsonapiBaseResponse } from '../interfaces/IJsonapi';
import { cancel_spinner, schedule_spinner } from './spinner';
import IStateDialog from '../interfaces/IStateDialog';
import StateNet from '../controllers/StateNet';
import { TThemeMode } from '../interfaces';
import Config from '../config';
import { THEME_DEFAULT_MODE, THEME_MODE } from '../constants';
import { net_patch_state } from './actions';
import { ler } from '../business.logic/logging';

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
  const status = json.meta?.status || 500;
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
function _resolve_unexpected_nesting (response: any) {
  if (response.response) {// Case of nested response
    return response.response;
  }

  // ... other cases

  return response;
}

/**
 * Get dialog state from the server.
 *
 * @param redux store, actions, etc.
 * @param dialogId
 * @returns dialog state
 */
export async function get_dialog_state <T=any>(
  redux: IRedux,
  dialogId: string
): Promise<IStateDialog<T>|null> {
  const rootState = redux.store.getState();
  const mode = Config.read<TThemeMode>(THEME_MODE, THEME_DEFAULT_MODE);
  const dialogActiveState = rootState.dialogs[dialogId];
  const dialogLightState = rootState.dialogsLight[dialogId];
  const dialogDarkState = rootState.dialogsDark[dialogId];
  if (!dialogLightState || !dialogDarkState) {
    ler(`get_dialog_state: ${dialogId} missing light or/and dark theme(s).`);
    remember_error({
      code: 'not_found',
      title: `${dialogId} Not Found`,
      detail: `${dialogId} missing light or/and dark theme(s).`,
      source: { pointer: dialogId }
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
    'key': dialogId,
    'mode': mode
  }, headers);
  if (response?.errors) {
    ler(`get_dialog_state: ${response.errors?.[0]?.title}`);
    remember_jsonapi_errors(response.errors);
    return null;
  }
  const main = response?.state?.dialogs?.[dialogId];
  const light = response?.state?.dialogsLight?.[dialogId];
  const dark = response?.state?.dialogsDark?.[dialogId];
  if (!main
    || !light
    || !dark
  ) {
    ler(`get_dialog_state: ${dialogId} not found.`);
    remember_error({
      code: 'not_found',
      title: `${dialogId} Not Found`,
      detail: `All three state of ${dialogId} are required but one or more are`
        + `missing.`,
      source: { pointer: dialogId }
    });
    return null;
  }
  const themedDialogState = get_themed_state<IStateDialog<T>>(
    mode,
    main,
    light,
    dark
  )
  if (themedDialogState._key !== dialogId) {
    ler(`get_dialog_state: ${dialogId} does not match ${themedDialogState._key}.`);
    remember_error({
      code: 'not_found',
      title: `${dialogId} Not Found`,
      detail: `${dialogId} does not match ${themedDialogState._key}.`,
      source: { pointer: dialogId }
    });
    return null;
  }
  redux.store.dispatch(net_patch_state(response.state));
  return themedDialogState;
}

export async function post_fetch<T=any>(
  url: string,
  body: T,
  customHeaders?: RequestInit['headers']
): Promise<any> {
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

export async function get_fetch<T=any>(url: string): Promise<T> {
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
  body: any,
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
      const json = _resolve_unexpected_nesting(await response.json());
      json.meta = json.meta || {};
      json.meta.status = response.status;
      json.meta.statusText = response.statusText;
      json.meta.ok = response.ok
      delegate_data_handling(dispatch, getState, endpoint, json);
    } catch (error: any) {
      remember_exception(error);
      delegate_error_handling(dispatch);
    }
  }
};

export const put_req_state = (
  endpoint: string,
  body?: any,
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
    } catch (error: any) {
      remember_exception(error);
      delegate_error_handling(dispatch);
    }
  }
};

export const axios_post_req_state = (
  _endpoint: string,
  _body?: any,
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
  body: any,
  success?: (state: any, endpoint: string) => void,
  failure?: (error: any) => void
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
  success?: (endpoint: string, state: any) => void,
  failure?: (error: any) => void
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
