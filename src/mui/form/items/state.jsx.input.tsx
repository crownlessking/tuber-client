import { Input } from '@mui/material';
import { useSelector } from 'react-redux';
import type StateFormItem from '../../../controllers/StateFormItem';
import { type RootState } from '../../../state';
import { StateJsxAdornment } from './state.jsx.input.adornment';
import StateFormsData from '../../../controllers/StateFormsData';

export default function StateJsxInput ({ def: input }: { def: StateFormItem }) {
  const formsData = new StateFormsData(
    useSelector((state: RootState) => state.formsData)
  );
  const value = formsData.getValue<string>(input.parent.name, input.name, '');

  return (
    <Input
      startAdornment={<StateJsxAdornment def={input.has.startAdornment} />}
      {...input.props}
      error={input.has.regexError(value)}
      value={value}
      onChange={input.onChange(input.name)}
    />
  );
}
