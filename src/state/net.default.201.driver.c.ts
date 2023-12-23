import { Dispatch } from 'redux'
import { is_object, clean_endpoint_ending } from '../business.logic'
import {
  IJsonapiAbstractResponse,
  IJsonapiResponse
} from '../interfaces/IJsonapi'
import {
  appRequestFailed,
  appRequestSuccess
} from '../slices/app.slice'
import { log, ler, pre, net_patch_state, RootState } from '.'
import { dataStackCol, dataStack } from '../slices/data.slice'
import { metaAdd } from '../slices/meta.slice'

export default function net_default_201_driver (
  dispatch: Dispatch,
  getState: ()=> RootState,
  endpoint: string,
  response: IJsonapiAbstractResponse
): void {
  const doc = response as IJsonapiResponse
  if (!!(doc.meta || doc.data || doc.links || doc.state)) {
    dispatch(appRequestSuccess())
  } else {
    dispatch(appRequestFailed())
  }
  pre('net_default_201_driver:')
  log('Received response:', doc)
  if (doc.data) {
    if (Array.isArray(doc.data) && doc.data.length === 1) {
      dispatch(dataStackCol({
        endpoint: clean_endpoint_ending(endpoint),
        collection: doc.data
      }))
    } else if (Array.isArray(doc.data) && doc.data.length > 1) {
      ler('more than one resource received on a 201 response.')
    } else if (is_object(doc.data)) {
      dispatch(dataStack({
        endpoint: clean_endpoint_ending(endpoint),
        data: doc.data
      }))
    }
  }
  if (doc.meta) {
    const { meta } = doc
    dispatch(metaAdd({ endpoint, meta }))
  }
  if (is_object(doc.state)) {
    dispatch(net_patch_state(doc.state))
  }
  pre()
}
