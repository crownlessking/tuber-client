import { clear_last_content_jsx } from 'src/business.logic/cache';
import Config from 'src/config';
import { THEME_DEFAULT_MODE, THEME_MODE } from 'src/constants.client';
import { TThemeMode } from 'src/common.types';
import { type IRedux } from 'src/state';

/** @id 44_C_1 */
export default function toggle_theme_mode (redux: IRedux) {
  return async () => {
    const { store: { dispatch }, actions } = redux;
    const rootState = redux.store.getState();
    const oldMode = Config.read<TThemeMode>(
      THEME_MODE,
      THEME_DEFAULT_MODE
    );
    const {
      pagesLight,
      pagesDark,
      formsLight,
      formsDark,
      dialogsLight,
      dialogsDark,
      themeLight,
      themeDark
    } = rootState;
    setTimeout(() => {
      if (oldMode === 'dark') {
        clear_last_content_jsx();
        dispatch(actions.dialogDismount());
        // dispatch(actions.appThemeModeUpdate('light'));
        dispatch(actions.formsAddMultiple(formsLight));
        dispatch(actions.dialogsAddMultiple(dialogsLight));
        dispatch(actions.pagesAddMultiple(pagesLight));
        dispatch(actions.themeSet(themeLight));
        document.cookie = 'mode=light';
        Config.write(THEME_MODE, 'light');
        return;
      }
      if (oldMode === 'light') {
        clear_last_content_jsx();
        dispatch(actions.dialogDismount());
        // dispatch(actions.appThemeModeUpdate('dark'));
        dispatch(actions.formsAddMultiple(formsDark));
        dispatch(actions.dialogsAddMultiple(dialogsDark));
        dispatch(actions.pagesAddMultiple(pagesDark));
        dispatch(actions.themeSet(themeDark));
        document.cookie = 'mode=dark';
        Config.write(THEME_MODE, 'dark');
        return;
      }
    });
  };
}
