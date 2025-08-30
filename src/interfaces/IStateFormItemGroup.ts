import IAbstractState from './IAbstractState';
import IStateFormItem from './IStateFormItem';

export type TItemGroup = 'box' | 'stack' | 'localized' | 'form_group'
                          | 'form_control' | 'form_control_label' | 'indeterminate'
                          | 'div' | 'none';

export default interface IStateFormItemGroup extends IAbstractState {
  /**  Layout for form items. */
  type ?:TItemGroup;
  items ?:IStateFormItem[];
}
