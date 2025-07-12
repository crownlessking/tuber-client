import { SxProps } from '@mui/material/styles';
import { CSSProperties } from 'react';
import { IAbstractState } from '../common.types';
import { IHtmlAttributes } from '.';
import IStateFormItem from './IStateFormItem';

export interface IStateCardProps {
  children?: any;
  classes?: Record<string, string>;
  raised?: boolean;
  sx?: SxProps;
}

export interface IStateCardContentTypographyProps extends IHtmlAttributes {
  gutterBottom?: boolean;
  variant?: string;
}

export interface IStateCardContentProps {
  children?: any;
  classes?: Record<string, string>;
  component?: string;
  sx?: SxProps;
  typographyProps?: IHtmlAttributes;
}

export interface IStateCardActionAreaProps {
  children?: any;
  classes?: Record<string, string>;
  sx?: SxProps;
}

export interface IStateCardActionsProps {
  children?: any;
  classes?: Record<string, string>;
  disableSpacing?: boolean;
  sx?: SxProps;
}

export interface ICardMediaProps extends IHtmlAttributes {
  children?: any;
  classes?: Record<string, string>;
  component?: string | JSX.Element;
  image?: string;
  /** use when `component` is `img` */
  width?: string;
  /** use when `component` is `img` */
  height?: string;
  /** use when `component` is `img` */
  alt?: string;
  translate?: 'yes' | 'no';
  inputMode?: 'search' | 'text' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal';
  style?: CSSProperties;
}

export interface IAvatarProps extends IHtmlAttributes {
  alt?: string;
  children?: any;
  classes?: Record<string, string>;
  imgProps?: IHtmlAttributes;
  sizes?: string;
  src?: string;
  srcSet?: string;
  sx?: SxProps;
  variant?: 'circular' | 'rounded' | 'square';
}

export interface ICardHeaderProps {
  action?: JSX.Element;
  avatar?: JSX.Element;
  classes?: Record<string, string>;
  subheader?: string;
  component?: string | JSX.Element;
  disableTypography?: boolean;
  subheaderTypographyProps?: Record<string, any>;
  sx?: SxProps;
  title?: string;
  titleTypographyProps?: Record<string, any>;
}

export default interface IStateCard extends IAbstractState {
  _type: 'basic'
    | 'card'
    | 'complex'
    | 'media'
    | 'image_media'
    | 'multi_action_area';
  props?: IStateCardProps;
  mediaProps?: ICardMediaProps;
  contentProps?: IStateCardContentProps;
  actionArea?: IStateCardActionAreaProps;
  actionsProps?: IStateCardActionsProps;
  actions?: IStateFormItem[];
  headerProps?: ICardHeaderProps;
  avatarProps?: IAvatarProps;
  title?: string;
  fullText?: string;
}