import { THive } from '..';
import type StateFormItem from '../../../../controllers/StateFormItem';
import StateFormItemSelect from '../../../../controllers/templates/StateFormItemSelect';
import DialogSelectDefault from './default.select';
import DialogSelectNative from './native.select';

interface IDialogSelect {
  def: StateFormItem;
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
