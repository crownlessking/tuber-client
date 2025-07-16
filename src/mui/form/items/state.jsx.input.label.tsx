import { InputLabel } from '@mui/material';
import type StateFormItem from '../../../controllers/StateFormItem';

interface IJsonInputLabelProps {
  def: StateFormItem;
}

export default function StateJsxInputLabel ({ def: label }: IJsonInputLabelProps) {
  return <InputLabel {...label.props}>{ label.text }</InputLabel>;
}
