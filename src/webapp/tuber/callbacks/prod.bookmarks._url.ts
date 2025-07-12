import { get_parsed_page_content, safely_get_as } from 'src/controllers';
import { IRedux } from 'src/state';
import { remember_error, remember_exception } from 'src/business.logic/errors';
import { URL_DIALOG_ID_NEW } from '../tuber.config';
import parse_platform_video_url from '../tuber.platform.drivers';
import FormValidationPolicy from 'src/controllers/FormValidationPolicy';
import { get_dialog_state } from 'src/state/net.actions';
import { get_state_form_name } from '../../../business.logic';
import { ler } from '../../../business.logic/logging';

/**
 * Shows the dialog to insert a new video url from which the video bookmark
 * will be created.
 *
 * @id $3_C_1
 */
export function dialog_new_video_url(redux: IRedux) {
  return async () => {
    const { store: { dispatch } } = redux;
    const rootState = redux.store.getState();
    if (rootState.dialog._id === URL_DIALOG_ID_NEW) {
      dispatch({ type: 'dialog/dialogOpen' });
      return;
    }
    const dialogKey = rootState.stateRegistry[URL_DIALOG_ID_NEW];
    const newVideoUrlDialogState = await get_dialog_state(redux, dialogKey);
    if (!newVideoUrlDialogState) {
      ler(`'${dialogKey}' does not exists.`);
      return;
    }
    // if the dialog was NOT mounted
    if (rootState.dialog._key !== newVideoUrlDialogState._key) {
      dispatch({ type: 'dialog/dialogMount', payload: newVideoUrlDialogState });
    } else {
      dispatch({ type: 'dialog/dialogOpen' });
    }
  };
}

/**
 * Show the dialog to create a new bookmark from a video url.
 *
 * @id $1_C_1
 */
export default function dialog_new_bookmark_from_url(redux: IRedux) {
  return async () => {
    const rootState = redux.store.getState();
    const dialogKey = rootState.stateRegistry[URL_DIALOG_ID_NEW];
    const urlDialogState = await get_dialog_state(redux, dialogKey);
    if (!urlDialogState) {
      ler(`'${dialogKey}' does not exists.`);
      return;
    }
    const urlContent = get_parsed_page_content(urlDialogState.content);
    const urlFormName = get_state_form_name(urlContent.name);
    const url = safely_get_as<string>(rootState.formsData[urlFormName], `url`, '');

    try {
      const errorMessage = new FormValidationPolicy(redux, urlFormName);
      const video = parse_platform_video_url(url);
      if (!video.urlCheck.valid) {
        ler(`dialog_new_bookmark_from_url: ${video.urlCheck.message}`);
        remember_error({
          code: 'bad_value',
          title: 'Invalid URL',
          detail: video.urlCheck.message,
          source: { pointer: url }
        });
        errorMessage.emit('url', video.urlCheck.message);
        return;
      }
      const newBookmarkDialogKey = rootState.stateRegistry[video.dialogId];
      if (!newBookmarkDialogKey) {
        ler(`dialog_new_bookmark_from_url: ${video.platform} dialog key not found.`);
        return;
      }
      const newBookmarkDialogState = await get_dialog_state(redux, newBookmarkDialogKey);
      if (!newBookmarkDialogState) {
        ler(`dialog_new_bookmark_from_url: ${video.platform} dialog json not found.`);
        return;
      }
      const content = get_parsed_page_content(newBookmarkDialogState.content);
      const formName = get_state_form_name(content.name);
      redux.store.dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: urlFormName,
          name: 'url',
          value: ''
        }
      });
      if (video.platform === 'unknown'
        || video.platform === 'facebook'
      ) {
        redux.store.dispatch({
          type: 'formsData/formsDataUpdate',
          payload: {
            formName,
            name: 'url',
            value: url
          }
        });
      }
      redux.store.dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName,
          name: 'platform',
          value: video.platform
        }
      });
      if (video.platform === 'rumble'
        || video.platform === 'odysee'
      ) {
        redux.store.dispatch({
          type: 'formsData/formsDataUpdate',
          payload: {
            formName,
            name: 'slug',
            value: video.slug
          }
        });
      }
      if (video.platform === 'youtube'
        || video.platform === 'vimeo'
        || video.platform === 'dailymotion'
        || video.platform === 'twitch'
      ) {
        redux.store.dispatch({
          type: 'formsData/formsDataUpdate',
          payload: {
            formName,
            name: 'videoid',
            value: video.id
          }
        });
      }
      if (video.platform === 'youtube'
        || video.platform === 'vimeo'
        || video.platform === 'rumble'
        || video.platform === 'odysee'
        || video.platform === 'facebook'
        || video.platform === 'twitch'
        || video.platform === 'dailymotion'
      ) {
        redux.store.dispatch({
          type: 'formsData/formsDataUpdate',
          payload: {
            formName,
            name: 'start_seconds',
            value: video.start
          }
        });
      }
      if (video.platform === 'youtube'
        || video.platform === 'dailymotion'
      ) {
        redux.store.dispatch({
          type: 'formsData/formsDataUpdate',
          payload: {
            formName,
            name: 'thumbnail_url',
            value: video.thumbnailUrl
          }
        });
      }
      // if the dialog was NOT mounted
      if (rootState.dialog._id !== newBookmarkDialogState._id) {
        redux.store.dispatch({
          type: 'dialog/dialogMount',
          payload: newBookmarkDialogState
        });
      } else {
        redux.store.dispatch({ type: 'dialog/dialogOpen' });
      }
    } catch (e: any) {
      ler(`dialog_new_bookmark_from_url: ${e.message}`);
      remember_exception(e);
    }
  };
}

/**
 * Triggers the callback to create a new video bookmark from url when the
 * [enter] key is pressed.
 *
 * @id $1_C_2
 */
export function dialog_new_bookmark_from_url_on_enter_key (
  redux: IRedux
) {
  return (e: any) => {
    if (e.key !== 'Enter') { return; }
    dialog_new_bookmark_from_url(redux)();
  }
}