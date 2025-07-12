import { log } from 'src/business.logic/logging';
import JsonapiRequest from 'src/controllers/jsonapi.request';
import { post_req_state } from 'src/state/net.actions';
import { IRedux } from '../../../state';
import { DIALOG_VIMEO_NEW_ID, FORM_VIMEO_NEW_ID } from '../tuber.config';
import { IBookmark } from '../tuber.interfaces';
import { get_dialog_form_endpoint, get_form_data } from './_callbacks.common.logic';

/**
 * [ **Vimeo** ] Save bookmark to server.
 * @param redux store, actions, and route.
 * @returns The callback function.
 * @id $14_C_1
 */
export default function form_submit_new_vimeo_bookmark(redux: IRedux) {
  return async () => {
    const { store: { getState, dispatch }, actions } = redux;
    const rootState = getState();
    const endpoint = get_dialog_form_endpoint(rootState, DIALOG_VIMEO_NEW_ID);
    if (!endpoint) { return; }
    const data = get_form_data(redux, FORM_VIMEO_NEW_ID);
    if (!data) { return; }
    const { formData, formName } = data;
    const platform = formData.platform;
    const videoid = formData.videoid;
    const start_seconds = formData.start_seconds;
    const end_seconds = formData.end_seconds;
    const title = formData.title;
    const note = formData.note;
    const requestBody = new JsonapiRequest<IBookmark>('bookmarks', {
      platform,
      videoid,
      start_seconds,
      end_seconds,
      title,
      note
    }).build();
    log('form_submit_new_vimeo_bookmark: requestBody', requestBody);
    dispatch(post_req_state('bookmarks', requestBody));
    dispatch(actions.formsDataClear(formName));
    dispatch(actions.dialogClose());
  };
}
