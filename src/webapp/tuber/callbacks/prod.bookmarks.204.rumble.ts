import { get_parsed_content } from 'src/controllers';
import StateTmp from 'src/controllers/StateTmp';
import { type IRedux } from 'src/state';
import { remember_error, remember_exception } from 'src/business.logic/errors';
import { put_req_state } from 'src/state/net.actions';
import { get_state_form_name } from '../../../business.logic';
import { IBookmark } from '../tuber.interfaces';
import FormValidationPolicy from 'src/controllers/FormValidationPolicy';
import { ler, msg, pre } from '../../../business.logic/logging';

/**
 * [ **Rumble** ] Save bookmark changes to server.
 * @param redux store, actions, and route.
 * @returns The callback function.
 * @id $11_C_1
 */
export default function form_submit_edit_rumble_bookmark(redux: IRedux) {
  return async () => {
    try {
      const { store: { getState, dispatch }, actions } = redux;
      const rootState = getState();
      const tmp = new StateTmp(rootState.tmp);
      tmp.configure({ dispatch });
      const index = tmp.get<number>('dialogEditBookmark', 'index', -1);
      pre('form_submit_edit_rumble_bookmark:');
      if (index === -1) {
        ler('index not found.');
        remember_error({
          code: 'value_not_found',
          title: 'Bookmark resource index not found',
        });
        return;
      }
      // Careful, `rootState.dialog` is only valid if the right dialog state
      // is mounted.
      const { _key, content } = rootState.dialog;
      const {name, endpoint } = get_parsed_content(content);
      if (!endpoint) {
        const errorMsg = `No endpoint defined for '${_key}'.`;
        ler(errorMsg);
        remember_error({
          code: 'value_not_found',
          title: errorMsg,
          source: { parameter: 'endpoint' }
        });
        return;
      }
      const formName = get_state_form_name(name);
      if (!rootState.formsData[formName]) {
        const errorMsg = msg(` '${formName}' data does not exist.`);
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
          const message = vError.message ?? '';
          policy.emit(vError.name, message);
        });
        return;
      }
      const existingBookmarkResource = rootState
        .data
        .bookmarks?.[index];

      if (!existingBookmarkResource) {
        ler('bad bookmark resource index.');
        return;
      }
      pre();
      const formData = policy.getFilteredData();
      const editedBookmarkResource = {
        ...existingBookmarkResource,
        attributes: {
          ...existingBookmarkResource.attributes,
          ...formData
        }
      };
      dispatch(actions.dataUpdateByIndex({
        endpoint,
        index,
        resource: editedBookmarkResource
      }));
      dispatch(put_req_state(
        `${endpoint}/${editedBookmarkResource.id}`,
        { data: editedBookmarkResource }
      ));
      dispatch(actions.formsDataClear(formName));
      dispatch(actions.dialogClose());
    } catch (e) {
      ler((e as Error).message);
      remember_exception(e, msg((e as Error).message));
    }
  };
}