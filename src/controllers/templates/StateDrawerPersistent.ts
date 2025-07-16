import { type DrawerProps } from '@mui/material';
import StatePageDrawer from './StatePageDrawer';

export default class StateDrawerPersistent extends StatePageDrawer {
  
  get props(): DrawerProps {
    return {
      sx: {
        width: this.drawerState.width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: this.drawerState.width,
          boxSizing: 'border-box',
        },
      },
      variant: "persistent"
    };
  }

}
