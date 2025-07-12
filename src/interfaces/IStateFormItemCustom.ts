import { BadgeProps } from '@mui/material';
import { IAdornment } from '../common.types';
import { IRedux, TReduxHandle } from '../state';
import { IStateFormItemInputProps } from './IStateFormItem';

export default interface IStateFormItemCustom<T = any> {
  callback?: (redux: IRedux) => (e: any) => void;
  /** CSS classes (JSS), most likely inherited from parent element */
  classes?: any;
  content?: string;
  color?: string;
  /**
   * Currently the only way to set the default value for a
   * field. Don't use the `value` attribute, it will not
   * work with React/Redux.
   */
  defaultValue?: string;
  /** Display a Material UI icon */
  icon?: string;
  /** Display a Material UI icon */
  svgIcon?: string;
  /** Display a Font-Awesome icon */
  faIcon?: string;
  /**
   * #1 Whether the icon within the button should be located to the left or
   *    right of the label.
   */
  iconPosition?: 'left' | 'right';
  /** To be spread on `Icon` and `FontAwesomeIcon` component tags. */
  iconProps?: any;
  /** Contains data for <select />,  */
  items?: T[];
  /** Component id */
  id?: string;
  /**
   * Used in certain situations when the label attribute cannot be set on
   * HTMLElement directly.
   */
  label?: string;
  predefinedRegex?: 'username' | 'email' | 'phone';
  route?: string;
  text?: string;
  /** Get human-readable helper text. */
  helperText?: string;
  title?: string;
  variant?: string;
  /**
   * badge props. If defined, the badge will show  
   * Badge example:
   * ```ts
   * const badge = { badgeContent: 0, color: 'error' };
   * ```
   */
  badge?: BadgeProps;
  /**
   * **Usage**:
   * to be used with `load` when loading `meta`. e.g.
   * ```ts
   * const meta = stateMeta['load']['key']
   * ```
   */
  key?: string;
  /**
   * Name of a pre-defined callback to be executed
   * .e.g.
   * ```ts
   * const callbackGroup = {
   *    callback1: () => { ... },
   *    callback2: () => { ... }
   *    // ... more callbacks
   * };
   * window.callbackGroup = callbackGroup;
   * ```
   * Then call with handle:
   * ```ts
   * const formItem = {
   *   has: {
   *     handle: 'onclick: callbackGroup.callback1'
   *   }
   * };
   * ```
   */
  onclickHandle?: string;
  onfocusHandle?: string;
  onchangeHandle?: string;
  onkeydownHandle?: string;
  onblurHandle?: string;
  ondeleteHandle?: string;
  /** Used by the Chip component */
  onClick?: TReduxHandle;
  /** Used by the Chip component */
  onDelete?: TReduxHandle;
  /**
   * Load metadata into field from `state.meta`. The metadata will be
   * identified by the endpoint (this value). If the data is missing, the
   * normal data source will be used.
   */
  load?: string;
  /** Material UI adornments. */
  startAdornment?: IAdornment;
  endAdornment?: IAdornment;
  props?: any;
  inputProps?: IStateFormItemInputProps;
  /** JSS style */
  theme?: any;
  /** Used for select components */
  formControlProps?: any;
  /** Used for select components */
  formControlLabelProps?: any;
  /** Used for select components */
  inputLabelProps?: any;
  /** Used for radio components */
  formLabelProps?: any;
  /** Used for radio components */
  radioGroupProps?: any;
  /** Use for switch components */
  formGroupProps?: any;
  /** Use for select and switch components */
  formHelperTextProps?: any;
  highlight?: string;
  /** Maximum length of the input field. */
  maxLength?: number;
  /** Message to display if the value of the input field exceeds `maxLength` */
  maxLengthMessage?: string;
  /**
   * Set to `true` to disable some fields on error.
   * [TODO] Does not work. Needs to be implemented.
   */
  disableOnError?: boolean;
  /**
   * Regular expression to disallow certain words or characters in an input field.  
   * Every word or character should be separated by a vertical bar,
   * for example. the regex would be: `/password|credit/` or `@|'|"|%`  
   * In this case, the regex must not match for the input to be valid.
   */
  invalidationRegex?: string;
  /**
   * Message to display if the value of the input field matches
   * `invalidationRegex`
   */
  invalidationMessage?: string;
  /**
   * Regular expression to validate an input field.  
   * e.g. `/^\d{5}-\d{4}$/` to validate a zip code  
   * In this case, the regex must match for the input to be valid.
   */
  validationRegex?: string;
  /**
   * Message to display when the input field did not match `validationRegex`.  
   * e.g. "Please enter a valid zip code."
   */
  validationMessage?: string;
  /** Input is not allowed to be empty. */
  required?: boolean;
  /** Message to display if the input is empty. */
  requiredMessage?: string;
}

export type THandleCallback = 'onclick'
  | 'onchange'
  | 'onkeydown'
  | 'onblur'
  | 'onfocus'
  | 'ondelete';

