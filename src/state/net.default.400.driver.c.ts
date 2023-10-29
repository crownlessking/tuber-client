import { Dispatch } from 'redux'
import { ler } from 'src/controllers'
import { IJsonapiResponse } from 'src/controllers/interfaces/IJsonapi'
import { appRequestFailed } from 'src/slices/app.slice'
import { RootState } from '.'
import {
  mongo_object_id,
  remember_error,
  remember_jsonapi_errors
} from './_errors.business.logic'

export default function net_default_400_driver (
  dispatch: Dispatch,
  getState: ()=> RootState,
  endpoint: string,
  response: IJsonapiResponse
): void {
  if (!response.errors) {
    const title = 'net_default_400_driver: No errors were received.'
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
  remember_jsonapi_errors(response.errors)
  ler(`net_default_400_driver: endpoint: ${endpoint}`)
  ler('net_default_400_driver: response:', response)
  dispatch(appRequestFailed())
}