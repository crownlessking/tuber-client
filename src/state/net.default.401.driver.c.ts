import { Dispatch } from 'redux';
import { is_object } from 'src/business.logic';
import {
  remember_error,
  remember_jsonapi_errors
} from 'src/business.logic/errors';
import { IJsonapiResponse } from 'src/interfaces/IJsonapi';
import { appRequestFailed } from 'src/slices/app.slice';
import { RootState } from '.';
import execute_directives from './net.directives.c';
import { net_patch_state, state_reset } from './actions';
import { ler } from '../business.logic/logging';

export default function net_default_401_driver (
  dispatch: Dispatch,
  getState: ()=> RootState,
  endpoint: string,
  response: IJsonapiResponse
): void {
  dispatch(appRequestFailed());

  if (is_object(response.state)) {
    dispatch(net_patch_state(response.state));
  }

  if (response.meta) {
    execute_directives(dispatch, response.meta);
  }

  if (!response.errors) {
    const title = 'net_default_401_driver: No errors were received.';
    ler(title);
    remember_error({
      id: 'net_default_401_driver: no_errors',
      code: 'no_errors',
      title,
      detail: JSON.stringify(response, null, 4),
      source: { 'pointer': endpoint },
    });
    return;
  }

  remember_jsonapi_errors(response.errors);
  ler(`net_default_401_driver: endpoint: ${endpoint}`);
  ler('net_default_401_driver: response:', response);

  dispatch(state_reset());
}