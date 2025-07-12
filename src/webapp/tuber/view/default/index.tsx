import '../tuber.css';
import { Fragment, useState, useLayoutEffect } from 'react';
import StatePage from '../../../../controllers/StatePage';
import { IBookmark, IResearchToolbarProps } from '../../tuber.interfaces';
import TuberBookmarkList from './list';
import TuberPlayer from './player';
import tuber_register_callbacks from '../../callbacks/tuber.callbacks';
import { styled, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import ResearchToolbarFixed from '../tuber.toolbar.video.search';
// import TuberBookmarkSearchEngine from './tuber.bookmark.search.engine'
import TuberBookmarkSearchWithThumbnails from './list.no.player';
import dialog_new_youtube_bookmark_from_video
  from '../../callbacks/prod.bookmarks.youtube';
import { useMediaQuery } from '@mui/material';
import TuberThumbnailedBookmarkList from './list.with.thumbnail';
import { on_bootstrap_run } from 'src/state';
import StateNet from 'src/controllers/StateNet';
import { IJsonapiStateResponse } from 'src/interfaces/IJsonapi';

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
  const [ playerOpen, setPlayerOpen ] = useState<boolean>(false);
  const [ bookmarkToPlay, setBookmarkToPlay ] = useState<IBookmark>();
  const [ showThumbnail, setShowThumbnail ] = useState<boolean>(true);
  const theme = useTheme();
  const greaterThanMid = useMediaQuery(theme.breakpoints.up('md'));

  const toolbarProps: IResearchToolbarProps = {
    togglePlayerCallback: () => () => {
      if (greaterThanMid) {
        setPlayerOpen(!playerOpen);
      } else {
        setPlayerOpen(false);
      }
    },
    /** Creates a new bookmark @deprecated */
    bookmarkAddCallback: dialog_new_youtube_bookmark_from_video,
    toggleThumbnailsCallback: () => () => {
      setShowThumbnail(!showThumbnail);
    },
    // appbar definition
    def: page.appbar
  };

  // Closes the integrated player if window size too small.
  useLayoutEffect(() => {
    const updateLayout = () => {
      if (!greaterThanMid) {
        setPlayerOpen(false);
      }
    };
    window.addEventListener('resize', updateLayout);
    updateLayout();
    return () => window.removeEventListener('resize', updateLayout);
  });

  return (
    <Fragment>
      <Toolbar />
        {playerOpen ? (
          <Grid container direction='row'>
            {showThumbnail ? (
              <TuberThumbnailedBookmarkList
                props={{
                  playerOpen,
                  setPlayerOpen,
                  setBookmarkToPlay
                }}
              />
            ) : (
              <TuberBookmarkList
                props={{
                  playerOpen,
                  setPlayerOpen,
                  setBookmarkToPlay
                }}
              />
            )}
            <TuberPlayerWrapper>
              <TuberPlayer
                props={{
                  isOpen: playerOpen,
                  bookmark: bookmarkToPlay,
                  toolbarProps
                }}
              />
            </TuberPlayerWrapper>
          </Grid>
        ) : (
          <Fragment>
            <TuberBookmarkSearchWithThumbnails
              props={{
                playerOpen,
                setPlayerOpen,
                setBookmarkToPlay
              }}
            />
            <ResearchToolbarFixed {...toolbarProps} />
          </Fragment>
        )}
    </Fragment>
  );
}
