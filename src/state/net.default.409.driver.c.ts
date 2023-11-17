import { Dispatch } from 'redux'
import { mongo_object_id } from '../business.logic'
import { IJsonapiAbstractResponse, IJsonapiErrorResponse } from 'src/interfaces/IJsonapi'
import { appRequestFailed } from 'src/slices/app.slice'
import { ler, net_patch_state, RootState } from '.'
import { is_object } from '../controllers'
import {
  remember_error,
  remember_jsonapi_errors
} from '../business.logic/errors'

export default function net_default_409_driver (
  dispatch: Dispatch,
  _getState: () => RootState,
  endpoint: string,
  response: IJsonapiAbstractResponse
): void {
  dispatch(appRequestFailed())
  const doc = response as IJsonapiErrorResponse

  if (is_object(doc.state)) {
    dispatch(net_patch_state(response.state))
  }

  if (!doc.errors) {
    const title = 'net_default_409_driver: No errors were received.'
    ler(title)
    remember_error({
      id: mongo_object_id(),
      code: 'no_errors',
      title,
      detail: JSON.stringify(response, null, 4),
      source: { 'pointer': endpoint },
    })
    return
  }

  remember_jsonapi_errors(doc.errors)
  ler(`net_default_409_driver: endpoint: ${endpoint}`)
  ler('net_default_409_driver: response:', response)
}