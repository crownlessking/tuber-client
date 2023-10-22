import grey from '@mui/material/colors/grey'
import { styled } from '@mui/material/styles'
import IStateLink from 'src/controllers/interfaces/IStateLink'
import StateLink from 'src/controllers/StateLink'
import StatePageAppBar from 'src/controllers/templates/StatePageAppBar'
import Link from 'src/mui/link'
import { IResearchToolbarProps } from '../tuber.interfaces'

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

/** When clicked, this icon will show or hide the list of annotations. */
// const AnnotationsListIcon = ({ callback, def: appBar }: IToolbarIcon) => {
//   const annotationsListIconDef = new StateLink({
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
//   return <Link def={annotationsListIconDef} />
// }

/** When clicked, this icon displays an interface to create a new video annotation. */
// const AddAnnotation = ({ callback, def: appBar}: IToolbarIcon) => {
//   const iconDef = new StateLink({
//     'type': 'icon',
//     'props': {
//       'size': 'small'
//     },
//     'has': {
//       'icon': 'playlist_add_outline',
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

/** When clicked, this icon will show or hide the list of annotations. */
// const ToggleAnnotationsIcon = ({ callback, def: appBar }: IToolbarIcon) => {
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
          'color': grey[600],
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
  return (
    <Toolbar>
      <ToggleWrapper>
        <IntegratedPlayerToggle
          callback={props.togglePlayerCallback}
          def={appBar}
        />
      </ToggleWrapper>
    </Toolbar>
  )
}
