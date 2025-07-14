import {
  CSSObject, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText,
  styled, Theme, useTheme
} from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { useDispatch, useSelector } from 'react-redux'
import StatePageDrawer from 'src/controllers/templates/StatePageDrawer'
import store, { AppDispatch, RootState, actions } from 'src/state'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Link as RouterLink } from 'react-router-dom'
import { JsxUnifiedIconProvider } from '../state.jsx.icons'
import { get_drawer_width } from '../../state'
import { Fragment } from 'react'
import { get_formatted_route } from 'src/controllers/StateLink'

const openedMixin = (theme: Theme): CSSObject => ({
  width: get_drawer_width(),
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: get_drawer_width(),
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
)

interface IMiniDrawerProps {
  def: StatePageDrawer
}

export default function MiniDrawer({ def: drawer }: IMiniDrawerProps) {
  const open = useSelector((state: RootState) => state.drawer.open)
  const dispatch = useDispatch<AppDispatch>()
  const theme = useTheme()

  const handleDrawerClose = () => {
    dispatch({ type: 'drawer/drawerClose' })
  }

  return (
    <Drawer
      {...drawer.props}
      variant="permanent"
      open={open}
    >
      { !drawer.parent.hideAppbar && drawer.parent.hasAppbar ? (
        <Fragment>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />    
        </Fragment>
      ) :
        ( null ) }
      <List>
        { drawer.items.map((item, i) => (
          <ListItem
            key={i + 1}
            button
            onClick={item.onClick({store, actions, route: item.has.route})}
            component={RouterLink as any}
            to={get_formatted_route(item.has)}
          >
            <ListItemIcon>
              <JsxUnifiedIconProvider def={item.has} />
            </ListItemIcon>
            <ListItemText primary={item.has.state.text} />
          </ListItem>
        )) }
      </List>
    </Drawer>
  )
}
