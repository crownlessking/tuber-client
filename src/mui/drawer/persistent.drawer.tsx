import {
  Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText,
  styled, useTheme
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type StateDrawerPersistent from 'src/controllers/templates/StateDrawerPersistent';
import store, { type AppDispatch, type RootState, actions } from 'src/state';
import { Link as RouterLink } from 'react-router-dom';
import { StateJsxIcon, StateJsxUnifiedIconProvider } from '../icon';
import { Fragment, memo } from 'react';
import { get_formatted_route } from 'src/controllers/StateLink';

/*
  [TODO] Duplicate this code so the drawer can appear on the right
*/

interface PerDrawerProps {
  def: StateDrawerPersistent;
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const ChevronLeftIcon = memo(() => <StateJsxIcon name={'chevron_left'} />);
const ChevronRightIcon = memo(() => <StateJsxIcon name={'chevron_right'} />);

export default function PersistentDrawer({def: drawer }: PerDrawerProps) {
  const open = useSelector((state: RootState) => state.drawer.open);
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const handleDrawerClose = () => {
    dispatch({ type: 'drawer/drawerClose' });
  };

  return (
    <Drawer
      variant="persistent"
      {...drawer.props}
      open={open}
    >
      { !drawer.parent.hideAppbar && drawer.parent.hasAppbar ? (
        <Fragment>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
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
            component={RouterLink}
            to={get_formatted_route(item.has)}
          >
            <ListItemIcon>
              <StateJsxUnifiedIconProvider def={item.has} />
            </ListItemIcon>
            <ListItemText primary={item.has.state.text} />
          </ListItem>
        )) }
      </List>
    </Drawer>
  );
}
