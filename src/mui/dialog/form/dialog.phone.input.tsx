import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { forwardRef, useState } from 'react';
import { IMaskInput } from 'react-imask';
import { THive } from '.';
import type StateFormItemInput from '../../../controllers/templates/StateFormItemInput';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const TextMaskCustom = forwardRef<HTMLElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="+1 (#00) 000-0000"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref as any}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  }
)

interface IDialogPhoneInput {
  def: StateFormItemInput;
  hive: THive;
}

export default function DialogPhoneInput(props: IDialogPhoneInput) {
  const hive  = props.hive;
  const input = props.def;
  input.configure('phone');

  const [value, setValue] = useState<string>(hive[input.name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    hive[input.name] = v;
  }

  return (
    <FormControl {...input.formControlProps}>
      <InputLabel {...input.inputLabelProps}>{ input.label }</InputLabel>
      <Input
        {...input.props}
        name={input.name}
        value={value}
        onChange={handleChange}
        inputComponent={TextMaskCustom as any}
      />
    </FormControl>
  );
}
