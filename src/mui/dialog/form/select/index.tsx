import { THive } from '..';
import {
  StateForm,
  type StateFormItem,
  StateFormItemSelect
} from '../../../../controllers';
import DialogSelectDefault from './default.select';
import DialogSelectNative from './native.select';
import IStateFormItemSelectOption from 'src/interfaces/IStateFormItemSelectOption';

interface IDialogSelect {
  def: StateFormItem<StateForm, IStateFormItemSelectOption>;
  hive: THive;
}

export default function DialogSelect ({def, hive}: IDialogSelect) {
  const formItemSelect = new StateFormItemSelect(def.state, def.parent);
  const table: { [type: string]: JSX.Element } = {
    'default': <DialogSelectDefault def={formItemSelect} hive={hive} />,
    'native': <DialogSelectNative def={formItemSelect} hive={hive} />
  };

  return table[formItemSelect._type.toLowerCase()];
}
