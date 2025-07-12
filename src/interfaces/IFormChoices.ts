// import { RadioProps } from '@mui/material';
import { IAbstractState } from '../common.types';
import IStateFormItemCustom from './IStateFormItemCustom';

export default interface IFormChoices extends IAbstractState {
  name?: string;
  label?: string;
  color?: any; // RadioProps['color'];
  disabled?: boolean;
  has?: IStateFormItemCustom;
}

export interface IStateFormItemRadioButton extends IFormChoices { }
