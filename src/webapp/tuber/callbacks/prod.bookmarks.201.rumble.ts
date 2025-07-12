import { log } from 'src/business.logic/logging';
import JsonapiRequest from 'src/controllers/jsonapi.request';
import { IRedux } from 'src/state';
import { post_req_state } from 'src/state/net.actions';
import { DIALOG_RUMBLE_NEW_ID, FORM_RUMBLE_NEW_ID } from '../tuber.config';
import { IBookmark } from '../tuber.interfaces';
import { get_dialog_form_endpoint, get_form_data } from './_callbacks.common.logic';

/**
 * [ **Rumble** ] Save bookmark to server.
 * @param redux store, actions, and route.
 * @returns The callback function.
 * @id $8_C_1
 */
export default function form_submit_new_rumble_bookmark(redux: IRedux) {
  return async () => {
    const { store: { getState, dispatch }, actions } = redux;
    const rootState = getState();
    const endpoint = get_dialog_form_endpoint(rootState, DIALOG_RUMBLE_NEW_ID);
    if (!endpoint) { return; }
    const data = get_form_data<IBookmark>(redux, FORM_RUMBLE_NEW_ID);
    if (!data) { return; }
    const { formData, formName } = data;
    const platform = formData.platform;
    const slug = formData.slug;
    const start_seconds = formData.start_seconds;
    const title = formData.title;
    const note = formData.note;
    const requestBody = new JsonapiRequest(endpoint, {
      slug,
      platform,
      start_seconds,
      title,
      note
    }).build();
    log('form_submit_new_rumble_bookmark: requestBody', requestBody);
    dispatch(post_req_state(endpoint, requestBody));
    dispatch(actions.formsDataClear(formName));
    dispatch(actions.dialogClose());
  };
}
