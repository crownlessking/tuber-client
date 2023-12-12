import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import IStateLink from 'src/interfaces/IStateLink'
import StateLink from 'src/controllers/StateLink'
import StatePageAppBar from 'src/controllers/templates/StatePageAppBar'
import Link from 'src/mui/link'
import { IResearchToolbarProps } from '../tuber.interfaces'
import { RootState } from 'src/state'
import StateSession from 'src/controllers/StateSession'

// const Spacing = styled('div')(({ theme }) =>  ({
//   marginRight: '33%'
// }))

interface IToolbarIcon {
  /** Callback to run when the toolbar icon is clicked. */
  callback: IStateLink['onClick']
  /** Parent definition for state links. It is required. */
  def: StatePageAppBar
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
}))

const ToggleWrapper = styled('div')(({ theme: { breakpoints } }) => ({
  [breakpoints.down('md')]: {
    display: 'none'
  },
  [breakpoints.up('md')]: {
    display: 'block'
  }
}))

/** When clicked, this icon will show or hide the list of bookmarks. */
// const BookmarksListIcon = ({ callback, def: appBar }: IToolbarIcon) => {
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
//   }, appBar)
//   return <Link def={bookmarksListIconDef} />
// }

/** When clicked, this icon displays an interface to create a new video bookmark. */
const AddBookmark = ({ def: appBar }: IToolbarIcon) => {
  const iconDef = new StateLink({
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
    // 'onClick': callback
  }, appBar)
  return <Link def={iconDef} />
}

/** When clicked, this icon will show or hide the list of bookmarks. */
// const ToggleBookmarksIcon = ({ callback, def: appBar }: IToolbarIcon) => {
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
//   }, appBar)
//   return <Link def={iconDef} />
// }

const ShowThumbnailsToggle = ({ callback, def: appBar }: IToolbarIcon) => {
  const iconDef = new StateLink({
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
  }, appBar)
  return <Link def={iconDef} />
}

const IntegratedPlayerToggle = ({ callback, def: appBar }: IToolbarIcon) => {
  const iconDef = new StateLink({
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
      'route': appBar.parent._key // 'research-app'
    },
    'onClick': callback
  }, appBar)
  return <Link def={iconDef} />
}

export default function ResearchToolbar (props: IResearchToolbarProps) {
  const { def: appBar } = props
  const { sessionValid } = new StateSession(
    useSelector((state: RootState) => state.session)
  )
  return (
    <Toolbar>
      <ToggleWrapper>
        {sessionValid ? (
          <>
            <AddBookmark
              callback={props.bookmarkAddCallback}
              def={appBar}
            />
            <ShowThumbnailsToggle
              callback={props.toggleThumbnailsCallback}
              def={appBar}
            />
            <IntegratedPlayerToggle
              callback={props.togglePlayerCallback}
              def={appBar}
            />
          </>
        ) : ( null )}
      </ToggleWrapper>
    </Toolbar>
  )
}
