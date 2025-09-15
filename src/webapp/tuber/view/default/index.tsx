import '../tuber.css';
import { Fragment, useLayoutEffect, useMemo } from 'react';
import {
  StatePage,
  StateNet,
  StatePagesData
} from 'src/controllers';
import { IBookmark } from '../../tuber.interfaces';
import TuberBookmarkList from './list';
import TuberPlayer from './player';
import tuber_register_callbacks from '../../callbacks/tuber.callbacks';
import { styled, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import ResearchToolbarFixed from '../tuber.toolbar.video.search';
import TuberBookmarkSearchWithThumbnails from './list.no.player';
import { useMediaQuery } from '@mui/material';
import TuberThumbnailedBookmarkList from './list.with.thumbnail';
import { AppDispatch, on_bootstrap_run, RootState } from 'src/state';
import { IJsonapiStateResponse } from 'src/interfaces/IJsonapi';
import { useDispatch, useSelector } from 'react-redux';
import {
  ENDPOINT,
  PLAYER_OPEN,
  SET_TO_PLAY,
  SHOW_THUMBNAIL,
} from '../../tuber.config';
import { pagesDataAdd } from 'src/slices/pagesData.slice';

tuber_register_callbacks();
on_bootstrap_run(async ({ state }: IJsonapiStateResponse) => {
    if (!state.net) { return; }
    const net = new StateNet(state.net);

    // https://www.tabnine.com/academy/javascript/how-to-set-cookies-javascript/
    document.cookie = `token=${net.token}`;
    document.cookie = `role=${net.role}`;
    document.cookie = `name=${net.name}`;
    document.cookie = `jwt_version=${net.jwt_version}`;
});

const TuberPlayerWrapper = styled('div')(({ theme }) => ({
  flexGrow: 1,
  [theme.breakpoints.up('md')]: {
    paddingRight: theme.spacing(2),
  },
  height: 'calc(100vh - 128px)',
  top: 64,
  right: 0,
}));

export default function ViewDefault({ def: page }: { def: StatePage}) {
  const dispatch = useDispatch<AppDispatch>();
  const pagesDataState = useSelector((state: RootState) => state.pagesData);
  const pagesData = useMemo(
    () => new StatePagesData(pagesDataState),
    [pagesDataState]
  );
  pagesData.configure({ endpoint: ENDPOINT });

  const theme = useTheme();
  const currentGreaterThanMid = useMediaQuery(theme.breakpoints.up('md'));
  const playerOpen = pagesData.get<boolean>(PLAYER_OPEN);
  const showThumbnail = pagesData.get<boolean>(SHOW_THUMBNAIL);
  const bookmarkToPlay = pagesData.get<IBookmark>(SET_TO_PLAY);

  // Closes the integrated player if window size is too small.
  useLayoutEffect(() => {
    const updateLayout = () => {
      if (!currentGreaterThanMid) {
        dispatch(pagesDataAdd({
          route: ENDPOINT,
          key: PLAYER_OPEN,
          value: false
        }));
      }
    };
    window.addEventListener('resize', updateLayout);
    updateLayout();
    return () => window.removeEventListener('resize', updateLayout);
  }, [currentGreaterThanMid, dispatch]);

  return (
    <Fragment>
      <Toolbar />
        {playerOpen ? (
          <Grid container direction='row'>
            {showThumbnail ? (
              <TuberThumbnailedBookmarkList />
            ) : (
              <TuberBookmarkList />
            )}
            <TuberPlayerWrapper>
              <TuberPlayer bookmark={bookmarkToPlay} toolbarDef={page.appbar} />
            </TuberPlayerWrapper>
          </Grid>
        ) : (
          <Fragment>
            <TuberBookmarkSearchWithThumbnails />
            <ResearchToolbarFixed def={page.appbar} />
          </Fragment>
        )}
    </Fragment>
  );
}
