import { get_parsed_page_content } from 'src/controllers';
import { IJsonapiResponseResource } from 'src/interfaces/IJsonapi';
import StateTmp from 'src/controllers/StateTmp';
import { type IRedux } from 'src/state';
import { remember_error, remember_exception } from 'src/business.logic/errors';
import { delete_req_state, get_dialog_state } from 'src/state/net.actions';
import { get_state_form_name } from '../../../business.logic';
import { get_dialog_id_for_edit } from '../_tuber.common.logic';
import { IBookmark } from '../tuber.interfaces';
import { DIALOG_DELETE_BOOKMARK_ID } from '../tuber.config';
import { ler, log, pre } from '../../../business.logic/logging';

/** Get bookmarks data from redux store. */
function get_bookmark_resources (data: any) {
  return data.bookmarks as IJsonapiResponseResource<IBookmark>[]
    || [];
}

/**
 * Callback to open a form within a dialog to edit an bookmark.
 * @param i The index of the bookmark to edit.
 * @returns The callback function.
 */
export function dialog_edit_bookmark (i: number) {
  return (redux: IRedux) => {
    return async () => {
      const { store: { getState, dispatch }, actions: A } = redux;
      const rootState = getState();
      const resourceList = get_bookmark_resources(rootState.data);
      pre('bookmark_edit_callback:');
      if (resourceList.length === 0) {
        ler('No \'bookmarks\' found.');
        return;
      }
      const bookmark = resourceList[i];
      if (!bookmark) {
        ler(`resourceList['${i}'] does not exist.`);
        return;
      }

      // Init
      const platform = bookmark.attributes.platform;
      const dialogid = get_dialog_id_for_edit(platform);
      const dialogKey = rootState.stateRegistry[dialogid];
      const dialogState = await get_dialog_state(redux, dialogKey);
      if (!dialogState) {
        ler(`'${dialogKey}' does not exist.`);
        return;
      }

      // Populate the form
      try {
        const content = get_parsed_page_content(dialogState.content);
        const formName = get_state_form_name(content.name);
        if (platform === 'unknown') {
          dispatch(A.formsDataUpdate({
            formName,
            name: 'url',
            value: bookmark.attributes.url
          }));
          dispatch(A.formsDataUpdate({
            formName,
            name: 'embed_url',
            value: bookmark.attributes.embed_url
          }));
          dispatch(A.formsDataUpdate({
            formName,
            name: 'thumbnail_url',
            value: bookmark.attributes.thumbnail_url
          }));
        }
        if (platform === 'rumble'
          || platform === 'odysee'
        ) {
          dispatch(A.formsDataUpdate({
            formName,
            name: 'slug',
            value: bookmark.attributes.slug
          }));
        }
        dispatch(A.formsDataUpdate({
          formName,
          name: 'start_seconds',
          value: bookmark.attributes.start_seconds
        }));
        if (platform === 'youtube'
          // || platform === 'rumble'
          // || platform === 'vimeo'
          // || platform === 'odysee'
          // || platform === 'dailymotion'
        ) {
          dispatch(A.formsDataUpdate({
            formName,
            name: 'end_seconds',
            value: bookmark.attributes.end_seconds
          }));
        }
        if (platform === 'facebook') {
          dispatch(A.formsDataUpdate({
            formName,
            name: 'author',
            value: bookmark.attributes.author
          }));
        }
        dispatch(A.formsDataUpdate({
          formName,
          name: 'videoid',
          value: bookmark.attributes.videoid
        }));
        dispatch(A.formsDataUpdate({
          formName,
          name: 'platform',
          value: bookmark.attributes.platform
        }));
        dispatch(A.formsDataUpdate({
          formName,
          name: 'title',
          value: bookmark.attributes.title
        }));
        dispatch(A.formsDataUpdate({
          formName,
          name: 'note',
          value: bookmark.attributes.note
        }));
        if (platform !== 'unknown') {
          dispatch(A.formsDataUpdate({
            formName,
            name: 'is_published',
            value: bookmark.attributes.is_published
          }));
        }
      } catch (err: any) {
        ler(err.message);
        remember_exception(err, `dialog_edit_bookmark: ${err.message}`);
      }
      pre()
      if (rootState.dialog._id !== dialogState._id) { // if the dialog was NOT mounted
        dispatch(A.dialogMount(dialogState));
      } else {
        dispatch(A.dialogOpen());
      }
      dispatch(A.tmpAdd({
        id: 'dialogEditBookmark',
        name: 'index',
        value: i
      }));
      log('index:', i);
    }
  }
}

/**
 * Callback to open a dialog to delete an bookmark.
 * @param i The index of the bookmark to delete.
 * @returns The callback function.
 */
export function dialog_delete_bookmark (i: number) {
  return (redux: IRedux) => {
    return async () => {
      const { store: { dispatch }, actions: A } = redux;
      const rootState = redux.store.getState();
      const dialogKey = rootState.stateRegistry[DIALOG_DELETE_BOOKMARK_ID];
      const dialogState = await get_dialog_state(redux, dialogKey);
      pre('bookmark_delete_open_dialog_callback:');
      if (!dialogState) {
        ler(`'${dialogKey}' does not exist.`);
        return;
      }
      const resourceList = get_bookmark_resources(rootState.data);
      if (resourceList.length === 0) {
        ler('No \'bookmarks\' found.');
        return;
      }
      const bookmark = resourceList[i];
      if (!bookmark) {
        ler(`resourceList['${i}'] does not exist.`);
        return;
      }
      pre();

      // Open the dialog
      if (rootState.dialog._id !== dialogState._id) {// if the dialog was NOT mounted
        dispatch(A.dialogMount(dialogState));
      } else {
        dispatch(A.dialogOpen());
      }

      dispatch({
        type: 'tmp/tmpAdd',
        payload: {
          id: 'deleteBookmarkDialog',
          name: 'index',
          value: i
        }
      });
    };
  };
}

/**
 * Callback to delete bookmarks
 * @param redux The redux store.
 * @returns The callback function.
 */
export default function form_submit_delete_bookmark (redux: IRedux) {
  return async () => {
    const { store: { getState, dispatch }, actions: A } = redux;
    const rootState = getState();
    const resourceList = get_bookmark_resources(rootState.data);
    const tmp = new StateTmp(rootState.tmp);
    tmp.configure({ dispatch });
    const index = tmp.get<number>('deleteBookmarkDialog', 'index', -1);
    pre('bookmark_delete_callback:');
    if (resourceList.length === 0) {
      ler('No \'bookmarks\' found.');
      return;
    }
    const bookmark = resourceList[index];
    if (!bookmark) {
      ler(`resourceList['${index}'] does not exist.`);
      return;
    }
    const dialogKey = rootState.stateRegistry[DIALOG_DELETE_BOOKMARK_ID];
    const dialogState = rootState.dialogs[dialogKey];
    if (!dialogState) {
      ler(`'${dialogKey}' does not exist.`);
      remember_error({
        code: 'value_not_found',
        title: `'${dialogKey}' does not exist.`,
        source: { parameter: 'dialogKey' }
      });
      return;
    }
    pre();
    dispatch(A.dialogClose());
    dispatch(A.dataDeleteByIndex({
      endpoint: 'bookmarks',
      index
    }));
    // [TODO] Acquire the endpoint from the server eventually.
    dispatch(delete_req_state(`bookmarks/${bookmark.id}`));
  };
}