import {
  DATE_TIME_PICKER,
  DESKTOP_DATE_TIME_PICKER,
  MOBILE_DATE_TIME_PICKER,
} from '../../../constants.client';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useState } from 'react';
import { THive } from '.';
import type StateForm from '../../../controllers/StateForm';
import type StateFormItem from '../../../controllers/StateFormItem';
import { remember_exception } from '../../../business.logic/errors';
import { NAME_NOT_SET } from '../../../constants.client';
import { log } from '../../../business.logic/logging';

interface IJsonPickerProps {
  def: StateFormItem<StateForm>;
  hive: THive;
}

interface IPickerTable {
  [constant: string]: () => JSX.Element;
}

export default function DialogPicker({ def, hive }: IJsonPickerProps) {
  const [value, setValue] = useState<string>();

  const handleChange = (newValue: string | null) => {
    setValue(newValue ?? '');
    hive[def.name] = newValue;
  }

  const table: IPickerTable = {
    [DATE_TIME_PICKER]: () => (
      <DateTimePicker
        label="DateTimePicker"
        {...def.props}
        renderInput={(props: TextFieldProps) => <TextField {...props} />}
        value={value}
        onChange={handleChange}
      />
    ),
    [MOBILE_DATE_TIME_PICKER]: () => (
      <MobileDateTimePicker
        label="For mobile"
        {...def.props}
        value={value}
        onChange={handleChange}
        renderInput={(props: TextFieldProps) => <TextField {...props} />}
      />
    ),
    [DESKTOP_DATE_TIME_PICKER]: () => (
      <DesktopDateTimePicker
        label="For desktop"
        {...def.props}
        value={value}
        onChange={handleChange}
        renderInput={(props: TextFieldProps) => <TextField {...props} />}
      />
    ),
  };

  try {
    const constant = def.type.replace(/\s+/, '').toLowerCase();
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
