import { SxProps } from '@mui/material/styles';
import IStateFormItem from './IStateFormItem';
import {
  AvatarProps,
  CardHeaderProps,
  CardMediaOwnProps,
  CardMediaProps,
  TypographyProps
} from '@mui/material';
import { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import IAbstractState from './IAbstractState';

export interface IStateCardProps {
  children?: ReactNode;
  classes?: Record<string, string>;
  raised?: boolean;
  sx?: SxProps;
}

export interface IStateCardContentTypographyProps extends TypographyProps {
  gutterBottom?: boolean;
  variant?: TypographyProps['variant'];
}

export interface IStateCardContentProps {
  children?: ReactNode;
  classes?: Record<string, string>;
  component?: string;
  sx?: SxProps;
  typographyProps?: TypographyProps;
}

export interface IStateCardActionAreaProps {
  children?: ReactNode;
  classes?: Record<string, string>;
  sx?: SxProps;
}

export interface IStateCardActionsProps {
  children?: ReactNode;
  classes?: Record<string, string>;
  disableSpacing?: boolean;
  sx?: SxProps;
}

export interface ICardMediaProps extends CardMediaProps {
  children?: ReactNode;
  classes?: Record<string, string>;
  component?: ElementType<unknown>;
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

export interface IAvatarProps extends AvatarProps {
  alt?: string;
  children?: ReactNode;
  classes?: Record<string, string>;
  imgProps?: HTMLAttributes<HTMLImageElement> & { sx?: SxProps; };
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
  subheaderTypographyProps?: TypographyProps;
  sx?: SxProps;
  title?: string;
  titleTypographyProps?: TypographyProps;
}

export default interface IStateCard extends Omit<IAbstractState, 'props'> {
  _type: 'basic'
    | 'card'
    | 'complex'
    | 'media'
    | 'image_media'
    | 'multi_action_area';
  props?: IStateCardProps;
  mediaProps?: CardMediaOwnProps;
  contentProps?: IStateCardContentProps;
  actionArea?: IStateCardActionAreaProps;
  actionsProps?: IStateCardActionsProps;
  actions?: IStateFormItem[];
  headerProps?: CardHeaderProps;
  avatarProps?: IAvatarProps;
  title?: string;
  fullText?: string;
}