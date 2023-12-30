import { log } from 'src/business.logic/logging'
import JsonapiRequest from 'src/controllers/jsonapi.request'
import { post_req_state } from 'src/state/net.actions'
import { IRedux } from '../../../state'
import { DIALGO_DAILY_NEW_ID, FORM_DAILY_NEW_ID } from '../tuber.config'
import { IBookmark } from '../tuber.interfaces'
import { get_start_time_in_seconds } from '../_tuber.common.logic'
import {
  get_dialog_form_endpoint,
  get_form_data
} from './_callbacks.common.logic'

/**
 * [ **Dailymotion** ] Save bookmark to server.
 * @param redux store, actions, and route.
 * @returns The callback function.
 * @id $21_C_1
 */
export default function form_submit_new_daily_bookmark(redux: IRedux) {
  return async () => {
    const { store: { getState, dispatch }, actions } = redux
    const rootState = getState()
    const endpoint = get_dialog_form_endpoint(rootState, DIALGO_DAILY_NEW_ID)
    if (!endpoint) { return }
    const data = get_form_data<IBookmark>(redux, FORM_DAILY_NEW_ID)
    if (!data) { return }
    const { formData, formName } = data
    const platform = formData.platform
    const videoid = formData.videoid
    const start_seconds = get_start_time_in_seconds(formData.start_time)
    const title = formData.title
    const note = formData.note
    const thumbnail_url = formData.thumbnail_url
    const requestBody = new JsonapiRequest<IBookmark>(endpoint, {
      platform,
      videoid,
      thumbnail_url,
      start_seconds,
      title,
      note
    }).build()
    log('form_submit_new_daily_bookmark: requestBody', requestBody)

    dispatch(post_req_state(endpoint, requestBody))
    dispatch(actions.formsDataClear(formName))
    dispatch(actions.dialogClose())
  }
}
