import {
  AvatarProps,
  DialogActionsProps,
  DialogContentProps,
  DialogContentTextProps,
  DialogProps,
  DialogTitleProps,
  PaperProps,
  SlideProps,
  SxProps
} from '@mui/material';
import IStateForm from './IStateForm';
import IStateFormItem from './IStateFormItem';
import { ReactNode } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { TWithOptional } from '.';

/** @deprecated */
export interface IDialogProps {
  open?: boolean;
  onClose?: Function;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  /** @deprecated */
  backdropComponent?: ReactNode;
  children?: ReactNode;
  classes?: string[];
  disableEscapeKeyDown?: boolean;
  fullScreen?: boolean;
  fullWidth?: boolean;
  maxWidth?: 'xs'|'sm'|'md'|'lg'|'xl'| false;
  onBackdropClick?: () => void;
  PaperComponent?: ReactNode;
  PaperProps?: PaperProps;
  scroll?: 'body' | 'paper';
  sx?: SxProps;
  TransitionComponent?: ReactNode;
  transitionDuration?: ReactNode;
  TransitionProps?: TransitionProps;
  [prop: string]: unknown;
}

/** @deprecated */
export interface IDialogActionsProps {
  children?: ReactNode;
  classes?: string[];
  disableSpacing?: boolean;
  sx?: SxProps;
  [prop: string]: unknown;
}

/** @deprecated */
export interface IDialogContentProps {
  children?: ReactNode;
  classes?: string[];
  dividers?: boolean;
  sx?: SxProps;
  [prop: string]: unknown;
}

/** @deprecated */
export interface IDialogContentTextProps {
  children?: ReactNode;
  classes?: string[];
  sx?: SxProps;
  [prop: string]: unknown;
}

/** @deprecated */
export interface IDialogTitleProps {
  children?: ReactNode;
  classes?: string[];
  sx?: SxProps;
  [prop: string]: unknown;
}

/** @deprecated */
export interface ISlideProps {
  children?: ReactNode;
  addEndListener?: Function;
  appear?: boolean;
  container?: unknown;
  direction?: 'down'|'left'|'right'|'up';
  easing?: unknown;
  in?: boolean;
  timeout?: unknown;
  [prop: string]: unknown;
}

export interface IStateDialogAvatar {
  icon?: string;
  faIcon?: string;
  /** Don't use more than two letters. */
  text?: string;
  /** Spread me on an avatar component */
  props?: AvatarProps
}

export interface IStateDialogSelectionItem<T=unknown> {
  title?: string;
  avatar?: IStateDialogAvatar;
  info?: T;
}

/**
 * Dialog base state
 */
export default interface IStateDialog<T=unknown> extends Omit<IStateForm, 'props'> {
  /** Set the dialog type */
  _type?: 'selection' | 'alert' | 'form' | 'any';
  open?: boolean;
  title?: string;
  label?: string;
  contentText?: string;
  content?: unknown;
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
  props?: TWithOptional<DialogProps, 'open'>;
  /** @see https://mui.com/material-ui/api/dialog-title/ */
  titleProps?: DialogTitleProps;
  /** @see https://mui.com/material-ui/api/dialog-content/ */
  contentProps?: DialogContentProps;
  /** @see https://mui.com/material-ui/api/dialog-content-text/ */
  contentTextProps?: DialogContentTextProps;
  /** @see https://mui.com/material-ui/api/dialog-actions/ */
  actionsProps?: DialogActionsProps;
  /** @see https://mui.com/material-ui/api/slide/ */
  slideProps?: SlideProps;
}
