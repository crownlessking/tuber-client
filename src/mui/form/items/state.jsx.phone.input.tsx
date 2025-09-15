import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { forwardRef, ElementType } from 'react';
import { IMaskInput } from 'react-imask';
import { useSelector } from 'react-redux';
import {
  type StateFormItemInput,
  StateFormsData
} from '../../../controllers';
import { type RootState } from '../../../state';

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
        inputRef={ref}
        onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
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
  const formsData = new StateFormsData(useSelector((state: RootState) => state.formsData));
  const value = formsData.getValue(input.parent.name, input.name, '');

  return (
    <FormControl {...input.formControlProps}>
      <InputLabel {...input.inputLabelProps}>{ input.label }</InputLabel>
      <Input
        {...input.props}
        name={input.name}
        value={value}
        onChange={input.onChange(input.name)}
        inputComponent={TextMaskCustom as ElementType<unknown>}
      />
    </FormControl>
  );
}
