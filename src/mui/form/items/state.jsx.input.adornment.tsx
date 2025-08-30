import { InputAdornment, InputAdornmentProps } from '@mui/material';
import { IAdornment } from '../../../common.types';
import { StateJsxUnifiedIconProvider } from 'src/mui/icon';
import StateFormItemCustom from 'src/controllers/StateFormItemCustom';

const StateJsxAdornmentIcon = ({ i }: { i?: string; fa?: string;}) => {
  const icon = new StateFormItemCustom({ icon: i }, {});
  return <StateJsxUnifiedIconProvider def={icon} />;
}

/**
 * Converts the adornment's json definition to a component.
 * 
 * i.e.
 * ```ts
 * const adornment = {
 *   position: 'start' | 'end'
 *   icon?: string
 *   faIcon?: string
 *   text?: string
 *   // ...more props
 * }
 * ```
 * @param def 
 * @returns 
 */
export const StateJsxAdornment = (def ?:IAdornment) => {
  const { icon, faIcon, text, ...inputAdornmentProps } = def || {};
  return def ? (
    <InputAdornment {...(inputAdornmentProps as InputAdornmentProps)}>
      <StateJsxAdornmentIcon i={icon} fa={faIcon} />
      { text ? ' ' + text : '' }
    </InputAdornment>
  ) : undefined;
}
