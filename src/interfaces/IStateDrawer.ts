import { TWithOptional } from '../common.types';
import IAbstractState from './IAbstractState';
import IStateLink from './IStateLink';
import { DrawerProps } from '@mui/material';

export default interface IStateDrawer extends Omit<IAbstractState, 'props'> {
  props?: DrawerProps;
  /** drawer type. */
  anchor?: 'bottom' | 'left' | 'right' | 'top';
  _type?: 'mini' | 'persistent' | 'responsive' | 'temporary' | 'swipeable'
    | 'none';
  /** List of icons with the descriptions */
  items?: IStateLink[];
  /** Whether the drawer is open or not. */
  open?: boolean;
  /** Drawer's width in pixels. */
  width?: number;
}

/** Type for a drawer defined within a page. */
export interface IStatePageDrawer extends TWithOptional<IStateDrawer, 'width'> {
  content?: String[];
}
