import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';
import { useSelector } from 'react-redux';
import type StateFormItemInput from '../../../controllers/templates/StateFormItemInput';
import { type RootState } from '../../../state';
import { get_field_value } from './_items.common.logic';

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
  },
)

interface IDialogPhoneInput {
  def: StateFormItemInput;
}

export default function StateJsxPhoneInput({ def: input }: IDialogPhoneInput) {
  input.configure('phone');
  const formsData = useSelector<RootState>(state => state.formsData);
  const value = get_field_value(formsData, input.parent.name, input.name);

  return (
    <FormControl {...input.formControlProps}>
      <InputLabel {...input.inputLabelProps}>{ input.label }</InputLabel>
      <Input
        {...input.props}
        name={input.name}
        value={value}
        onChange={input.onChange(input.name)}
        inputComponent={TextMaskCustom as any}
      />
    </FormControl>
  );
}
