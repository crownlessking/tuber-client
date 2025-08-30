import type StateForm from 'src/controllers/StateForm';
import type StateFormItem from '../../../../controllers/StateFormItem';
import StateFormItemSelect from '../../../../controllers/templates/StateFormItemSelect';
import StateJsxSelectDefault from './default';
import StateJsxSelectNative from './native';
import IStateFormItemSelectOption from 'src/interfaces/IStateFormItemSelectOption';

interface IDialogSelect {
  def: StateFormItem<StateForm, IStateFormItemSelectOption>;
}

export default function DialogSelect ({def}: IDialogSelect) {
  const formItemSelect = new StateFormItemSelect(def.state, def.parent);
  const table: { [type: string]: JSX.Element } = {
    'default': <StateJsxSelectDefault def={formItemSelect} />,
    'native': <StateJsxSelectNative def={formItemSelect} />
  };

  return table[formItemSelect._type.toLowerCase()];
}
