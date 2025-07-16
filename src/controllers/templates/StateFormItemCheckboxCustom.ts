import type StateFormItemCheckbox from './StateFormItemCheckbox';
import StateFormItemCheckboxBox, {
type IStateFormItemCheckboxBox
} from '../StateFormItemCheckboxBox';
import StateFormItemCustom from '../StateFormItemCustom';

export default class StateFormItemCheckboxCustom extends StateFormItemCustom<
  StateFormItemCheckbox,
  IStateFormItemCheckboxBox
> {
  private _checkboxBoxes?: StateFormItemCheckboxBox[];

  get items(): StateFormItemCheckboxBox[] {
    return this._checkboxBoxes || (this._checkboxBoxes = this.hasItemsState.map(
      box => new StateFormItemCheckboxBox(box, this)
    ))
  }
}
