import { styled } from '@mui/material/styles';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import IStateLink from 'src/interfaces/IStateLink';
import StateLink from 'src/controllers/StateLink';
import StatePageAppbar from 'src/controllers/templates/StatePageAppbar';
import Link from 'src/mui/link';
import { IResearchToolbarProps } from '../tuber.interfaces';
import { RootState } from 'src/state';
import StateNet from 'src/controllers/StateNet';

interface IToolbarIcon {
  /** Callback to run when the toolbar icon is clicked. */
  callback: IStateLink['onClick'];
  /** Parent definition for state links. It is required. */
  def: StatePageAppbar;
}

const Toolbar = styled('div')(({ theme }) => ({
  width: 'fit-content', // theme.spacing(50),
  margin: `${theme.spacing(1)} 0 0 auto`,
  padding: theme.spacing(0.5, 1, 0.5, 1),
  borderRadius: '2em',
  // display: 'flex',
  position: 'absolute',
  bottom: 0,
  right: 0
}));

const ToggleWrapper = styled('div')(({ theme: { breakpoints } }) => ({
  [breakpoints.down('md')]: {
    display: 'none'
  },
  [breakpoints.up('md')]: {
    display: 'block'
  }
}));

/** When clicked, this icon will show or hide the list of bookmarks. */
// const BookmarksListIcon = ({ callback, def: appbar }: IToolbarIcon) => {
//   const bookmarksListIconDef = new StateLink({
//     'type': 'icon',
//     'props': {
//       'size': 'small',
//       // 'sx': { 'color': grey[300] }
//     },
//     'has': {
//       'icon': 'subscriptions_outline',
//       'iconProps': {
//         'sx': {
//           'color': grey[600],
//           'fontSize': 34
//         }
//       }
//     },
//     'onClick': callback
//   }, appbar)
//   return <Link def={bookmarksListIconDef} />
// }

/** When clicked, this icon displays an interface to create a new video bookmark. */
const AddBookmark = React.memo<IToolbarIcon>(({ def: appbar }) => {
  // Memoize the StateLink configuration to prevent recreation
  const iconDef = useMemo(() => new StateLink({
    'type': 'icon',
    'props': {
      'size': 'small'
    },
    'has': {
      'icon': 'add_outline',
      'iconProps': {
        'sx': {
          'color': 'grey.600',
          'fontSize': 34
        }
      },
      'onclickHandle': `tuberCallbacks.$3_C_1`,
    },
  }, appbar), [appbar]);

  return <Link def={iconDef} />;
});

// Set display name for debugging
AddBookmark.displayName = 'AddBookmark';

/** When clicked, this icon will show or hide the list of bookmarks. */
// const ToggleBookmarksIcon = ({ callback, def: appbar }: IToolbarIcon) => {
//   const iconDef = new StateLink({
//     'type': 'icon',
//     'props': {
//       'size': 'small'
//     },
//     'has': {
//       'icon': 'assignment_outline',
//       'iconProps': {
//         'sx': {
//           'color': grey[600],
//           'fontSize': 34
//         }
//       }
//     },
//     'onClick': callback
//   }, appbar)
//   return <Link def={iconDef} />
// }

const ShowThumbnailsToggle = React.memo<IToolbarIcon>(({ callback, def: appbar }) => {
  // Memoize the StateLink configuration to prevent recreation
  const iconDef = useMemo(() => new StateLink({
    'type': 'icon',
    'props': {
      'size': 'small'
    },
    'has': {
      'icon': 'insert_photo_outline',
      'iconProps': {
        'sx': {
          'color': 'grey.600',
          'fontSize': 34
        }
      },
    },
    'onClick': callback
  }, appbar), [callback, appbar]);

  return <Link def={iconDef} />;
});

// Set display name for debugging
ShowThumbnailsToggle.displayName = 'ShowThumbnailsToggle';

const IntegratedPlayerToggle = React.memo<IToolbarIcon>(({ callback, def: appbar }) => {
  // Memoize the StateLink configuration to prevent recreation
  const iconDef = useMemo(() => new StateLink({
    'type': 'icon',
    'props': {
      'size': 'small'
    },
    'has': {
      'icon': 'monitor_outline',
      'iconProps': {
        'sx': {
          'color': 'grey.600',
          'fontSize': 34
        }
      },
      'route': appbar.parent._key // 'research-app'
    },
    'onClick': callback
  }, appbar), [callback, appbar]);

  return <Link def={iconDef} />;
});

// Set display name for debugging
IntegratedPlayerToggle.displayName = 'IntegratedPlayerToggle';

const ResearchToolbar = React.memo<IResearchToolbarProps>((props) => {
  const { def: appbar } = props;
  
  // Memoize state selectors
  const netState = useSelector((rootState: RootState) => rootState.net);
  const { sessionValid } = useMemo(() => new StateNet(netState), [netState]);

  return (
    <Toolbar>
      <ToggleWrapper>
        {sessionValid ? (
          <>
            <AddBookmark
              callback={props.bookmarkAddCallback}
              def={appbar}
            />
            <ShowThumbnailsToggle
              callback={props.toggleThumbnailsCallback}
              def={appbar}
            />
            <IntegratedPlayerToggle
              callback={props.togglePlayerCallback}
              def={appbar}
            />
          </>
        ) : null}
      </ToggleWrapper>
    </Toolbar>
  );
});

// Set display name for debugging
ResearchToolbar.displayName = 'ResearchToolbar';

export default ResearchToolbar;
