import IStateAvatar from './IStateAvatar';
import IStateForm from './IStateForm';
import IStateFormItem from './IStateFormItem';

export interface IDialogProps {
  open?: boolean;
  onClose?: Function;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  /** @deprecated */
  backdropComponent?: any;
  children?: any;
  classes?: any;
  disableEscapeKeyDown?: boolean;
  fullScreen?: boolean;
  fullWidth?: boolean;
  maxWidth?: 'xs'|'sm'|'md'|'lg'|'xl'| false;
  onBackdropClick?: () => void;
  PaperComponent?: any;
  PaperProps?: any;
  scroll?: 'body' | 'paper';
  sx?: any;
  TransitionComponent?: any;
  transitionDuration?: any;
  TransitionProps?: any;
  [prop: string]: any;
}

export interface IDialogActionsProps {
  children?: any;
  classes?: any;
  disableSpacing?: boolean;
  sx?: any;
  [prop: string]: any;
}

export interface IDialogContentProps {
  children?: any;
  classes?: any;
  dividers?: boolean;
  sx?: any;
  [prop: string]: any;
}

export interface IDialogContentTextProps {
  children?: any;
  classes?: any;
  sx?: any;
  [prop: string]: any;
}

export interface IDialogTitleProps {
  children?: any;
  classes?: any;
  sx?: any;
  [prop: string]: any;
}

export interface ISlideProps {
  children?: any;
  addEndListener?: Function;
  appear?: boolean;
  container?: any;
  direction?: 'down'|'left'|'right'|'up';
  easing?: any;
  in?: boolean;
  timeout?: any;
  [prop: string]: any;
}

export interface IStateDialogSelectionItem<T=any> {
  title?: string;
  avatar?: IStateAvatar;
  info?: T;
}

/**
 * Dialog base state
 */
export default interface IStateDialog<T=any> extends IStateForm {
  /** Set the dialog type */
  _type?: 'selection' | 'alert' | 'form' | 'any';
  open?: boolean;
  title?: string;
  label?: string;
  contentText?: string;
  content?: any;
  /** Button component */
  actions?: IStateFormItem[]; // for defining the dialog actions
  /** [TODO] Check if this property is in use. If not, remove it. */
  showActions?: boolean;
  onSubmit?: () => void;
  /** Required for dialogs that display a list of items */
  list?: IStateDialogSelectionItem<T>[];
  /** 
   * When a dialog displays a list of items, this callback should run when 
   * clicking on an item.
   */
  callback?: (item: IStateDialogSelectionItem<T>) => void;

  /** @see https://mui.com/material-ui/api/dialog/ */
  props?: IDialogProps;
  /** @see https://mui.com/material-ui/api/dialog-title/ */
  titleProps?: IDialogTitleProps;
  /** @see https://mui.com/material-ui/api/dialog-content/ */
  contentProps?: IDialogContentProps;
  /** @see https://mui.com/material-ui/api/dialog-content-text/ */
  contentTextProps?: IDialogContentTextProps;
  /** @see https://mui.com/material-ui/api/dialog-actions/ */
  actionsProps?: IDialogActionsProps;
  /** @see https://mui.com/material-ui/api/slide/ */
  slideProps?: ISlideProps;
}
