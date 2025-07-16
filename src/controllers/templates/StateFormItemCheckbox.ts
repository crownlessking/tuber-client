import type StateForm from '../StateForm';
import StateFormItem from '../StateFormItem';
import { type IStateFormItemCheckboxBox } from '../StateFormItemCheckboxBox';
import StateFormItemCheckboxCustom from './StateFormItemCheckboxCustom';

export default class StateFormItemCheckbox extends StateFormItem<
  StateForm,
  IStateFormItemCheckboxBox
> {
  private _itemCheckboxHas?: StateFormItemCheckboxCustom;
  get has(): StateFormItemCheckboxCustom {
    return this._itemCheckboxHas || (
      this._itemCheckboxHas = new StateFormItemCheckboxCustom(
        this.itemHasState,
        this
      )
    );
  }
}
