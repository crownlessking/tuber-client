import { YouTubePlayer } from 'react-youtube';
import Config from 'src/config';
import { get_parsed_page_content } from 'src/controllers';
import { type IRedux } from 'src/state';
import { remember_exception } from 'src/business.logic/errors';
import { get_state_form_name } from '../../../business.logic';
import { TPlatform } from '../tuber.interfaces';
import { get_dialog_state } from 'src/state/net.actions';
import { ler } from '../../../business.logic/logging';

/**
 * [ **YouTube** ] Shows a dialog containing a form to create a new bookmark.
 *
 * @id 6
 * @deprecated
 */
export default function dialog_new_youtube_bookmark_from_video(redux: IRedux) {
  return async () => {
    const { store: { dispatch } } = redux;
    const rootState = redux.store.getState();
    const dialogKey = rootState.stateRegistry['6'];
    const dialogState = await get_dialog_state(redux, dialogKey);
    if (!dialogState) {
      ler(`'${dialogKey}' does not exist.`);
      return;
    }
    const player = Config.read<YouTubePlayer>('player');
    try {
      const content = get_parsed_page_content(dialogState.content);
      dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: get_state_form_name(content.name),
          name: 'start_seconds',
          value: Math.floor(await player.getCurrentTime())
        }
      });
      dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: get_state_form_name(content.name),
          name: 'videoid',
          value: Config.read<string>('videoid')
        }
      });
      dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: get_state_form_name(content.name),
          name: 'platform',
          value: Config.read<TPlatform>('platform')
        }
      });
    } catch (e: any) { remember_exception(e); }
  
    if (rootState.dialog._id !== dialogState._id) { // if the dialog was NOT mounted
      dispatch({ type: 'dialog/dialogMount', payload: dialogState });
    } else {
      dispatch({ type: 'dialog/dialogOpen' });
    }
  };
}