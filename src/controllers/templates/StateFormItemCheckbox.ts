import StateForm from '../StateForm';
import StateFormItem from '../StateFormItem';
import { IStateFormItemCheckboxBox } from '../StateFormItemCheckboxBox';
import StateFormItemCheckboxCustom from './StateFormItemCheckboxCustom';

export default class StateFormItemCheckbox extends StateFormItem<
  StateForm,
  IStateFormItemCheckboxBox
> {
  private itemCheckboxHas?: StateFormItemCheckboxCustom;
  get has(): StateFormItemCheckboxCustom {
    return this.itemCheckboxHas || (
      this.itemCheckboxHas = new StateFormItemCheckboxCustom(
        this.itemHasState,
        this
      )
    );
  };
}
