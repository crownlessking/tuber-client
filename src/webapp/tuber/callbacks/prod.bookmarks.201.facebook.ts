import JsonapiRequest from 'src/controllers/jsonapi.request';
import { type IRedux } from 'src/state';
import { post_req_state } from 'src/state/net.actions';
import { get_state_form_name, get_val } from '../../../business.logic';
import { FORM_FACEBOOK_NEW_ID } from '../tuber.config';
import { facebook_parse_iframe } from '../_tuber.common.logic';
import { IBookmark } from '../tuber.interfaces';
import { remember_error } from 'src/business.logic/errors';
import FormValidationPolicy from 'src/controllers/FormValidationPolicy';
import { get_dialog_form_endpoint } from './_callbacks.common.logic';
import { ler, log } from 'src/business.logic/logging';

/**
 * [ **Facebook** ] Save bookmark to server.
 * @param redux store, actions, and route.
 * @returns The callback function.
 * @id $26_C_1
 */
export default function form_submit_new_facebook_bookmark(redux: IRedux) {
  return async () => {
    const { store: { getState, dispatch }, actions } = redux;
    const rootState = getState();
    const endpoint = get_dialog_form_endpoint(rootState, FORM_FACEBOOK_NEW_ID);
    if (!endpoint) { return; }
    const formKey = get_val<string>(rootState, `stateRegistry.${FORM_FACEBOOK_NEW_ID}`);
    if (!formKey) {
      const errorMsg = 'form_submit_new_facebook_bookmark: Form key not found.';
      ler(errorMsg);
      remember_error({
        code: 'value_not_found',
        title: errorMsg,
        source: { parameter: 'formKey' }
      });
      return;
    }
    const formName = get_state_form_name(formKey);
    if (!rootState.formsData?.[formName]) {
      const errorMsg = `form_submit_new_facebook_bookmark: '${formName}' `
        + `data does not exist.`;
      ler(errorMsg);
      remember_error({
        code: 'value_not_found',
        title: errorMsg,
        source: { parameter: 'formData' }
      });
      return;
    }
    const policy = new FormValidationPolicy<IBookmark>(redux, formName);
    const validation = policy.getValidationSchemes();
    if (validation && validation.length > 0) {
      validation.forEach(vError => {
        const message = vError.message ?? ''
        policy.emit(vError.name, message)
      });
      return;
    }
    const formData = policy.getFilteredData();
    const [ author, videoid, start ] = facebook_parse_iframe(formData.embed_url);
    if (!author || !videoid) {
      ler('form_submit_new_facebook_bookmark: failed to get author and videoid!');
      policy.emit('embed_url', 'Bad embed URL.');
      return;
    }
    const start_seconds = parseInt(start);
    const requestBody = new JsonapiRequest(endpoint, {
      ...formData,
      videoid,
      author,
      start_seconds,
    }).build();
    log('form_submit_new_youtube_bookmark: requestBody', requestBody);
    dispatch(post_req_state(endpoint, requestBody));
    dispatch(actions.formsDataClear(formName));
    dispatch(actions.dialogClose());
  };
}
