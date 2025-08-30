
import { CSSProperties } from 'react';
import * as C from '../constants.client';
import IAbstractState from './IAbstractState';
import IStateFormItemCustom from './IStateFormItemCustom';
import IStateLink from './IStateLink';
import { InputProps } from '@mui/material/Input';
import { SxProps } from '@mui/material';

/**
 * When adding input adornment to a text field, It's the type for `start` and
 * `end` on a text field adornment.
 * ```ts
 * const textfieldState = {
 *   // ...
 *   'inputProps': {
 *     'start': {}, // <-- type for this.
 *     'end': {}    // <-- and this.
 *   }
 *   // ...
 * }
 * ```
 * @see https://mui.com/material-ui/react-text-field/#input-adornments
 */
export interface IStateFormItemAdornment {
  type?: 'text' | 'button';
  icon?: IStateLink;
  /** Fontawesone icon @deprecated */
  faIcon?: string;
  text?: string;
  textProps?: React.HTMLAttributes<HTMLSpanElement> & { sx?: SxProps };
  [x: string]: unknown;
}

/**
 * Used with textfield state to include input adornments.
 * ```ts
 * const textfieldState = {
 *   // ...
 *   'inputProps': { } // <-- type for this.
 *   // ...
 * };
 * ```
 * @see https://mui.com/material-ui/react-text-field/#input-adornments
 */
export interface IStateFormItemInputProps extends InputProps {
  start?: IStateFormItemAdornment;
  end?: IStateFormItemAdornment;
}

/** List of all possible type a form item can be. */
export type TStateFormItemType = typeof C.BREAK_LINE
  | typeof C.BOOL_ONOFF
  | typeof C.BOOL_TRUEFALSE
  | typeof C.BOOL_YESNO
  | typeof C.BOX
  | typeof C.STATE_BUTTON
  | typeof C.CHECKBOXES
  | typeof C.DATE_TIME_PICKER
  | typeof C.DESKTOP_DATE_PICKER
  | typeof C.DESKTOP_DATE_TIME_PICKER
  | typeof C.DIV
  | typeof C.A
  | typeof C.FORM
  | typeof C.FORM_CONTROL
  | typeof C.FORM_CONTROL_LABEL
  | typeof C.FORM_GROUP
  | typeof C.FORM_HELPER_TEXT
  | typeof C.FORM_LABEL
  | typeof C.HIGHLIGHT
  | typeof C.HORIZONTAL_LINE
  | typeof C.HTML
  | typeof C.INDETERMINATE
  | typeof C.STATE_INPUT
  | typeof C.INPUT_LABEL
  | typeof C.ICON
  | typeof C.LINK
  | typeof C.LOCALIZED
  | typeof C.MOBILE_DATE_PICKER
  | typeof C.MOBILE_DATE_TIME_PICKER
  | typeof C.NONE
  | typeof C.NUMBER
  | typeof C.PARAGRAPH
  | typeof C.PASSWORD
  | typeof C.PHONE_INPUT
  | typeof C.RADIO_BUTTONS
  | typeof C.STATE_SELECT
  | typeof C.STATE_SELECT_NATIVE
  | typeof C.STACK
  | typeof C.STATIC_DATE_PICKER
  | typeof C.SUBMIT
  | typeof C.SINGLE_SWITCH
  | typeof C.SWITCH
  | typeof C.TEXT
  | typeof C.TEXTAREA
  | typeof C.TEXTFIELD
  | typeof C.TEXT_NODE
  | typeof C.TIME_PICKER
  | typeof C.BAD_FORM_ITEM;

export default interface IStateFormItem<T=unknown> extends IAbstractState {
  /** Form field type e.g. textfield, select, radio... etc. */
  type?: TStateFormItemType;
  /** Form field `id` */
  id?: string;
  /** Form field `name` */
  name?: string;
  /** Form field `value` */
  value?: string;
  href?: string;
  style?: CSSProperties;
  onClick?: Function;
  onFocus?: Function;
  onKeyDown?: Function;
  onChange?: Function;
  onBlur?: Function;
  label?: string;
  highlight?: string;
  disabled?: boolean;
  /** Contains members that are generally not `JSX.Element` props. */
  has?: IStateFormItemCustom<T>;
  inputProps?: IStateFormItemInputProps;
  items?: Array<IStateFormItem>;
  /** Disable form item */
  disableOn?: ('click' | 'change' | 'blur' | 'error')[];
}
