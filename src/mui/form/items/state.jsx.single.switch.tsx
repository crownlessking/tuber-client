import { FormControl, FormHelperText } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { TBoolVal } from '../../../common.types';
import { NAME_NOT_SET } from '../../../constants.client';
import { type StateFormItemSwitch, StateFormsData } from '../../../controllers';
import { type RootState } from '../../../state';
import { to_bool_val } from '../_form.common.logic';

interface IJsonSingleSwitch {
  def: StateFormItemSwitch;
}

/**
 * Example:
 * ```ts
 * const $witchJson = {
 *    type: 'single_switch',
 *    name: 'published',
 *    label: 'Published', // Human-readable text
 *    has: {
 *      defaultValue: 'on', // on/off, yes/no, true/false
 *      helpText: 'Whether the document is visible to the public or not.',
 *    }
 * },
 * ```
 */
export default function StateJsxSingleSwitch({ 
  def: $witch
}: IJsonSingleSwitch) {
  const { name, disabled, onChange: handleChange } = $witch;
  const formsData = new StateFormsData(
    useSelector((state: RootState) => state.formsData)
  );
  const getValue = () => formsData.getValue<TBoolVal>(
    $witch.parent.name,
    $witch.name,
    'false'
  );

  return name ? (
    <FormControl
      component="fieldset"
      variant="standard"
      {...$witch.formControlProps}
    >
      <FormControlLabel
        {...$witch.formControlLabelProps}
        label={$witch.label}
        control={
          <Switch
            {...$witch.props}
            disabled={disabled === true}
            checked={to_bool_val(getValue())}
            onChange={handleChange(name, getValue())}
            value={name}
            inputProps={{ 'aria-label': $witch.label }}
          />
        }
      />
      <FormHelperText {...$witch.formHelperTextProps}>
        { $witch.has.helperText }
      </FormHelperText>
    </FormControl>
  ) : (
    <TextField
      variant='standard'
      value={`SWITCH ${NAME_NOT_SET}`}
      disabled
    />
  );
}
