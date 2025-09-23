import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, get_bootstrap_key, initialize } from './state';
import { post_req_state } from './state/net.actions';
import Config from './config';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import AppPage from './components/app.component';
import {
  ALLOWED_ATTEMPTS,
  BOOTSTRAP_ATTEMPTS,
  THEME_DEFAULT_MODE,
  THEME_MODE
} from './constants.client';
import { get_cookie } from './business.logic/parsing';
import StateAllPages from './controllers/StateAllPages';
import StateApp from './controllers/StateApp';
import StateNet from './controllers/StateNet';



export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const app = new StateApp(
    useSelector((state: RootState) => state.app)
  );
  const allPages = new StateAllPages(
    useSelector((state: RootState) => state.pages)
  );
  const net = new StateNet(
    useSelector((state: RootState) => state.net)
  );
  const themeState = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    /** Get state from server. */
    const onPostReqHomePageState = () => {
      const key = get_bootstrap_key();
      if (!key) { return; }
      const bootstrapAttempts = Config.read<number>(BOOTSTRAP_ATTEMPTS, 0);
      if (bootstrapAttempts < ALLOWED_ATTEMPTS) {
        dispatch(post_req_state(key, {
          cookie: document.cookie,
        }, net.headers));
        Config.write(BOOTSTRAP_ATTEMPTS, bootstrapAttempts + 1);
      }
    };
    // Get bootstrap state from server if none was provided.
    // Setting `fetchingStateAllowed` to `false` will prevent it.
    if (app.fetchingStateAllowed && !app.isBootstrapped) {
      onPostReqHomePageState();
    }

    Config.write(THEME_MODE, get_cookie('mode') || THEME_DEFAULT_MODE);
    initialize();
  }, [dispatch, net.headers, app.fetchingStateAllowed, app.isBootstrapped]);

  return (
    <ThemeProvider theme={createTheme(themeState)}>
      <CssBaseline />
      <AppPage def={allPages} info={app} />
    </ThemeProvider>
  );
}
