import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import StateFormItem from '../../../controllers/StateFormItem';
import { RootState } from '../../../state';
import { remember_exception } from '../../../business.logic/errors';
import {
  DATE_TIME_PICKER,
  DESKTOP_DATE_TIME_PICKER,
  MOBILE_DATE_TIME_PICKER,
  NAME_NOT_SET
} from '../../../constants.client';
import { log } from '../../../business.logic/logging';
import StateFormsData from '../../../controllers/StateFormsData';

interface IJsonPickerProps {
  def: StateFormItem;
}

interface IPickerTable {
  [constant: string]: () => JSX.Element;
}

export default function StateJsxPicker({ def }: IJsonPickerProps) {
  const { name, parent: { name: formName }, onChange: handleChange } = def;
  const formsData = new StateFormsData(
    useSelector((state: RootState) => state.formsData)
  );
  const value = formsData.getValue(formName, name, null);

  const table: IPickerTable = {
    [DATE_TIME_PICKER]: () => (
      <DateTimePicker
        label="DateTimePicker"
        {...def.props}
        renderInput={(props: TextFieldProps) => <TextField {...props} />}
        value={value}
        onChange={handleChange(name)}
      />
    ),
    [MOBILE_DATE_TIME_PICKER]: () => (
      <MobileDateTimePicker
        label="For mobile"
        {...def.props}
        value={value}
        onChange={handleChange(name)}
        renderInput={(props: TextFieldProps) => <TextField {...props} />}
      />
    ),
    [DESKTOP_DATE_TIME_PICKER]: () => (
      <DesktopDateTimePicker
        label="For desktop"
        {...def.props}
        value={value}
        onChange={handleChange(name)}
        renderInput={(props: TextFieldProps) => <TextField {...props} />}
      />
    ),
  };

  try {
    const constant = def.type.replace(/\s+/, '').toLowerCase()
    return def.nameProvided
      ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          { table[constant]() }
        </LocalizationProvider>
      )
      : <TextField value={`PICKER ${NAME_NOT_SET}`} disabled />;
  } catch (e) {
    remember_exception(e);
    log((e as Error).message);
  }

  return (null);
}
