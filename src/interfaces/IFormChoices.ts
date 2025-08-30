import IAbstractState from './IAbstractState';
import IStateFormItemCustom from './IStateFormItemCustom';

export default interface IFormChoices extends IAbstractState {
  name?: string;
  label?: string;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  disabled?: boolean;
  has?: IStateFormItemCustom;
}

export interface IStateFormItemRadioButton extends IFormChoices { }
