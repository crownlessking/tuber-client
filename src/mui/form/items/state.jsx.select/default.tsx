import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type StateFormItemSelect from '../../../../controllers/templates/StateFormItemSelect';
import { get_field_value } from '../_items.common.logic';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../state';
import { NAME_NOT_SET } from '../../../../constants';

interface IDialogSelectDefault {
  def: StateFormItemSelect;
}

export default function StateJsxSelectDefault (
  { def: select }: IDialogSelectDefault
) {
  const { name, parent: { name: formName } } = select;
  const formsData = useSelector<RootState>(state => state.formsData);
  const getValue = () => get_field_value(formsData, formName, name);

  return name ? (
    <FormControl {...select.formControlProps}>
      <InputLabel {...select.inputLabelProps}>
        { select.text }
      </InputLabel>
      <Select
        {...select.props}
        value={getValue()}
        onChange={select.onChange(name)}
      >
        <MenuItem value=''></MenuItem>
        {select.has.items.map((item, i) => (
          <MenuItem value={item.value} key={`select-menu-item${i}`}>
            { item.label || item.title || item.value }
          </MenuItem>
        ))}
      </Select>
      {select.has.helperText ? (
        <FormHelperText {...select.formHelperTextProps}>
          { select.has.helperText }
        </FormHelperText>
      ): ( null )}
    </FormControl>
  ) : (
    <TextField value={`SELECT ${NAME_NOT_SET}`} disabled />
  );
}
