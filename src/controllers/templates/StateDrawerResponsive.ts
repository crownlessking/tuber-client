import { type DrawerProps } from '@mui/material';
import StatePageDrawer from './StatePageDrawer';

export default class StateDrawerResponsive extends StatePageDrawer {
  private container = window !== undefined
    ? () => window.document.body
    : undefined
  
  /** `props` for temporary drawer. */
  get props(): DrawerProps {
    return {
      container: this.container,
      variant: 'temporary',
      ModalProps: {
        keepMounted: true, // Better open performance on mobile.
      },
      sx: {
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: this.width
        },
      },
      ...this.drawerState.props
    };
  }

  /** `props` for permanent drawer. */
  get propsPermanent(): DrawerProps {
    return {
      variant: 'permanent',
      sx: {
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: this.width
        },
      },
      open: true
    };
  }
}
