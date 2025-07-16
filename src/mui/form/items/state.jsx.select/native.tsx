import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { NAME_NOT_SET } from '../../../../constants';
import type StateFormItemSelect from '../../../../controllers/templates/StateFormItemSelect';
import type { RootState } from '../../../../state';
import { get_field_value } from '../_items.common.logic';

interface IDialogSelectNative { def: StateFormItemSelect; }

export default function StateJsxSelectNative (
  { def: select }: IDialogSelectNative
) {
  const { name, parent: { name: formName } } = select;
  select.configure('native');
  const formsData = useSelector<RootState>(state => state.formsData);
  const getValue = () => get_field_value(formsData, formName, name);

  return name ? (
    <FormControl {...select.formControlProps}>
      <InputLabel {...select.inputLabelProps}>
        { select.text }
      </InputLabel>
      <NativeSelect
        {...select.props}
        value={getValue()}
        inputProps={{
          name: select.name,
          id: select.config_id,
        }}
        onChange={select.onChange(name)}
      >
        <option value=''></option>
        {select.has.items.map((option, i) => (
          <option value={option.value} key={`select-menu-option${i}`}>
            { option.title || option.value }
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  ) : (
    <TextField value={`SELECT ${NAME_NOT_SET}`} disabled />
  );
}
