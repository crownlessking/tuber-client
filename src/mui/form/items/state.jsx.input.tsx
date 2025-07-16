import { Input } from '@mui/material';
import { useSelector } from 'react-redux';
import type StateFormItem from '../../../controllers/StateFormItem';
import { type RootState } from '../../../state';
import { get_field_value } from './_items.common.logic';
import { getAdornment } from './state.jsx.input.adornment';

export default function StateJsxInput ({ def: input }: { def: StateFormItem }) {
  const formsData = useSelector<RootState>(state => state.formsData);
  const value = get_field_value(formsData, input.parent.name, input.name);

  return (
    <Input
      startAdornment={getAdornment(input.has.startAdornment)}
      {...input.props}
      error={input.has.regexError(value)}
      value={value}
      onChange={input.onChange(input.name)}
    />
  );
}
