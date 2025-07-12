import { IAbstractState } from '../common.types';

export default interface IStateFormItemSwitchToggle extends IAbstractState {
  /** Switch label */
  label?: string;
  /** Switch value */
  name?: string;
  /** Use with switch component group */
  formControlLabelProps?: any;
}
