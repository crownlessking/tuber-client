import { TypographyProps } from '@mui/material/Typography';
import { TReduxHandle } from '../state';
import IAbstractState from './IAbstractState';
import IStateFormItemCustom from './IStateFormItemCustom';
import { SxProps } from '@mui/material/styles';

export interface IDefaultParent {
  menuItemsSx: SxProps;
  menuItemsProps: Record<string, unknown>;
  typography: TypographyProps;
}

export default interface IStateLink<T=unknown> extends IAbstractState {
  type?: 'text' | 'textlogo' | 'icon' | 'hybrid' | 'link' | 'svg' | 'svg_right'
          | 'svg_left';
  onClick?: TReduxHandle;
  href?: string;
  has?: IStateFormItemCustom<T>;
}
