import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import SwipeableDrawer, { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useDispatch, useSelector } from 'react-redux';
import store, { actions, type AppDispatch, type RootState } from 'src/state';
import { Link as RouterLink } from 'react-router-dom';
import type StatePageDrawer from 'src/controllers/templates/StatePageDrawer';
import { StateJsxUnifiedIconProvider } from '../icon';
import { get_formatted_route } from 'src/controllers/StateLink';

interface ITempDrawerProps {
  def: StatePageDrawer;
}

type TAnchor = 'top' | 'left' | 'bottom' | 'right';

export default function TempDrawer({ def: drawer }: ITempDrawerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const open = useSelector((state: RootState) => state.drawer.open ?? false);
  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    dispatch({ type: 'drawer/drawerClose' });
  };

  const list = (anchor: TAnchor = 'left') => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : drawer.width }}
    >
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
    </Box>
  );

  const drawerTable: {[prop: string]: JSX.Element } = {
    'temporary': (
      <Drawer
        {...drawer.props}
        open={open}
        onClose={toggleDrawer}
      >
        { list(drawer.props.anchor) }
      </Drawer>
    ),
    'swipeable': (
      <SwipeableDrawer
        {...drawer.props as SwipeableDrawerProps}
        open={open}
        onClose={toggleDrawer}
        onOpen={() => dispatch({ type: 'drawer/drawerOpen' })}
      >
        { list(drawer.props.anchor) }
      </SwipeableDrawer>
    )
  };

  return drawerTable[drawer._type.toLowerCase()];
}
