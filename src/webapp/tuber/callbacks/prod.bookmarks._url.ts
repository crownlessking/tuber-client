import {
  get_parsed_content,
  get_state_form_name
} from 'src/business.logic/parsing';
import { type IRedux } from 'src/state';
import { error_id } from 'src/business.logic/errors';
import { URL_DIALOG_ID_NEW } from '../tuber.config';
import parse_platform_video_url from '../tuber.platform.drivers';
import FormValidationPolicy from 'src/business.logic/FormValidationPolicy';
import { get_dialog_state } from 'src/state/net.actions';
import { safely_get_as } from 'src/business.logic/utility';
import { ler, pre } from 'src/business.logic/logging';

/**
 * Shows the dialog to insert a new video url from which the video bookmark
 * will be created.
 *
 * @id $3_C_1
 */
export function dialog_new_video_url(redux: IRedux) {
  return async () => {
    pre('dialog_new_video_url():');
    const { store: { dispatch } } = redux;
    const rootState = redux.store.getState();
    if (rootState.dialog._id === URL_DIALOG_ID_NEW) {
      dispatch({ type: 'dialog/dialogOpen' });
      return;
    }
    const newVideoUrlDialogState = await get_dialog_state(redux, URL_DIALOG_ID_NEW);
    if (!newVideoUrlDialogState) { return; }
    // if the dialog was NOT mounted
    if (rootState.dialog._key !== newVideoUrlDialogState._key) {
      dispatch({ type: 'dialog/dialogMount', payload: newVideoUrlDialogState });
    } else {
      dispatch({ type: 'dialog/dialogOpen' });
    }
    pre();
  };
}

/**
 * Show the dialog to create a new bookmark from a video url.
 *
 * @id $1_C_1
 */
export default function dialog_new_bookmark_from_url(redux: IRedux) {
  return async () => {
    pre('dialgo_new_bookmark_from_url():');
    const rootState = redux.store.getState();
    const urlDialogState = await get_dialog_state(redux, URL_DIALOG_ID_NEW);
    if (!urlDialogState) { return; }
    const urlContent = get_parsed_content(urlDialogState.content);
    const urlFormName = get_state_form_name(urlContent.name);
    const url = safely_get_as<string>(rootState.formsData[urlFormName], `url`, '');

    try {
      const errorMessage = new FormValidationPolicy(redux, urlFormName);
      const video = parse_platform_video_url(url);
      if (!video.urlCheck.valid) {
        ler(`dialog_new_bookmark_from_url: ${video.urlCheck.message}`);
        error_id(1073).remember_error({
          code: 'INTERNAL_ERROR',
          title: 'Invalid URL',
          detail: video.urlCheck.message,
          source: { pointer: url }
        }); // error 1073
        errorMessage.emit('url', video.urlCheck.message);
        return;
      }
      const newBookmarkDialogState = await get_dialog_state(redux, video.dialogId);
      if (!newBookmarkDialogState) { return; }
      const content = get_parsed_content(newBookmarkDialogState.content);
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
    } catch (e) {
      ler(`dialog_new_bookmark_from_url: ${(e as Error).message}`);
      error_id(1038).remember_exception(e); // error 1038
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
  return (e: unknown) => {
    if ((e as KeyboardEvent).key !== 'Enter') { return; }
    dialog_new_bookmark_from_url(redux)();
  }
}