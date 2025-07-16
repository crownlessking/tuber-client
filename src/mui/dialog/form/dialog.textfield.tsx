import { InputProps } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { THive } from '.';
import { NAME_NOT_SET } from '../../../constants';
import type StateFormItem from '../../../controllers/StateFormItem';
import getTextFieldAdornment from '../../form/items/state.jsx.input.adornment';
import { typeMap } from '../../form/items/state.jsx.textfield';

interface IJsonTextfieldProps {
  def: StateFormItem;
  hive: THive;
}

export default function DialogTextField({
  def: textfield,
  hive
}: IJsonTextfieldProps) {
  const defaultValue = hive[textfield.name] ?? '';
  const [value, setValue] = useState<any>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    hive[textfield.name] = e.target.value;
  }

  return textfield.name ? (
    <TextField
      {...textfield.props}
      label={textfield.label}
      type={typeMap[textfield.type]}
      error={textfield.has.regexError(value)}
      value={value}
      onChange={handleChange}
      InputProps={getTextFieldAdornment(textfield.inputProps)}
    />
  ) : (
    <TextField
      value={NAME_NOT_SET}
      InputProps={getTextFieldAdornment(textfield.inputProps) as Partial<InputProps>}
      disabled
    />
  );
}
