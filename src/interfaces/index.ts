import { CSSProperties } from 'react';
import { SxProps } from '@mui/material/styles';

export interface IHtmlAttributes {
  accept?: string;
  acceptCharset?: string;
  accessKey?: string;
  action?: string;
  align?: string;
  alt?: string;
  async?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  autoPlay?: boolean;
  bgColor?: string;
  border?: string;
  charset?: string;
  checked?: boolean;
  cite?: string;
  class?: string;
  color?: string;
  cols?: number;
  colspan?: number;
  content?: string;
  contentEditable?: boolean;
  controls?: boolean;
  coords?: string;
  data?: string;
  datetime?: string;
  default?: boolean;
  defer?: boolean;
  dir?: string;
  dirname?: string;
  disabled?: boolean;
  download?: any;
  draggable?: boolean;
  enctype?: string;
  enterKeyHint?: string;
  for?: string;
  form?: string;
  formAction?: string;
  headers?: string;
  height?: number | string;
  hidden?: boolean;
  high?: number;
  href?: string;
  hrefLang?: string;
  httpEquiv?: string;
  id?: string;
  inert?: boolean;
  inputMode?: any;
  ismap?: boolean;
  kind?: string;
  label?: string;
  lang?: string;
  list?: string;
  loop?: boolean;
  low?: number;
  max?: number | string;
  maxLength?: number;
  media?: string;
  method?: string;
  min?: number | string;
  multiple?: boolean;
  muted?: boolean;
  name?: string;
  noValidate?: boolean;
  onAbort?: any;
  onAfterPrint?: any;
  onBeforePrint?: any;
  onBeforeUnload?: any;
  onBlur?: any;
  onCanPlay?: any;
  onCanPlayThrough?: any;
  onChange?: any;
  onClick?: any;
  onContextMenu?: any;
  onCopy?: any;
  onCueChange?: any;
  onCut?: any;
  onDblClick?: any;
  onDrag?: any;
  onDragEnd?: any;
  onDragEnter?: any;
  onDragLeave?: any;
  onDragOver?: any;
  onDragStart?: any;
  onDrop?: any;
  onDurationChange?: any;
  onEmptied?: any;
  onEnded?: any;
  onError?: any;
  onFocus?: any;
  onHashChange?: any;
  onInput?: any;
  onInvalid?: any;
  onKeyDown?: any;
  onKeyPress?: any;
  onKeyUp?: any;
  onLoad?: any;
  onLoadedData?: any;
  onLoadedMetadata?: any;
  onLoadStart?: any;
  onMouseDown?: any;
  onMouseMove?: any;
  onMouseOut?: any;
  onMouseOver?: any;
  onMouseUp?: any;
  onMouseWheel?: any;
  onOffline?: any;
  onOnline?: any;
  onPageHide?: any;
  onPageShow?: any;
  onPaste?: any;
  onPause?: any;
  onPlay?: any;
  onPlaying?: any;
  onPopState?: any;
  onProgress?: any;
  onRateChange?: any;
  onReset?: any;
  onResize?: any;
  onScroll?: any;
  onSearch?: any;
  onSeeked?: any;
  onSeeking?: any;
  onSelect?: any;
  onStalled?: any;
  onStorage?: any;
  onSubmit?: any;
  onSuspend?: any;
  onTimeUpdate?: any;
  onToggle?: any;
  onUnload?: any;
  onVolumeChange?: any;
  onWaiting?: any;
  onWheel?: any;
  open?: boolean;
  optimum?: number;
  pattern?: string;
  placeholder?: string;
  popOver?: any;
  popOverTarget?: any;
  popOverTargetAction?: any;
  poster?: string;
  preload?: string;
  readOnly?: boolean;
  rel?: string;
  required?: boolean;
  reversed?: boolean;
  rows?: number;
  rowspan?: number;
  sandbox?: string;
  scope?: string;
  selected?: boolean;
  shape?: string;
  size?: number;
  sizes?: string;
  span?: number;
  spellcheck?: boolean;
  src?: string;
  srcDoc?: string;
  srcLang?: string;
  srcSet?: string;
  start?: number;
  step?: number | string;
  style?: CSSProperties;
  sx?: SxProps;
  tabIndex?: number;
  target?: string;
  title?: string;
  translate?: any;
  type?: string;
  useMap?: string;
  value?: string | string[] | number;
  width?: number | string;
  wrap?: string;
  classes?: Record<string, string>;
  component?: string | JSX.Element;
  image?: string;
}

/**
 * Makes a single property optional.
 *
 * @see https://stackoverflow.com/a/61108377/1875859
 */
export type TWithOptional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/** @see https://stackoverflow.com/a/69328045/1875859 */
export type TWithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export interface ITypography extends IHtmlAttributes {
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  children?: any;
  classes?: Record<string, string>;
  gutterBottom?: boolean;
  noWrap?: boolean;
  paragraph?: boolean;
  variant?: 'inherit'
    | 'body1'
    | 'body2'
    | 'button'
    | 'caption'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'overline'
    | 'subtitle1'
    | 'subtitle2'
    | 'srOnly';
  sx?: SxProps;
  variantMapping?: Partial<Record<'body1' | 'body2', string>>;
}

export type TThemeMode = 'light' | 'dark';