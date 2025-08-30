import { type CSSProperties } from 'react';
import { type SxProps } from '@mui/material/styles';

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
  download?: unknown;
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
  inputMode?: unknown;
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
  onAbort?: unknown;
  onAfterPrint?: unknown;
  onBeforePrint?: unknown;
  onBeforeUnload?: unknown;
  onBlur?: unknown;
  onCanPlay?: unknown;
  onCanPlayThrough?: unknown;
  onChange?: unknown;
  onClick?: unknown;
  onContextMenu?: unknown;
  onCopy?: unknown;
  onCueChange?: unknown;
  onCut?: unknown;
  onDblClick?: unknown;
  onDrag?: unknown;
  onDragEnd?: unknown;
  onDragEnter?: unknown;
  onDragLeave?: unknown;
  onDragOver?: unknown;
  onDragStart?: unknown;
  onDrop?: unknown;
  onDurationChange?: unknown;
  onEmptied?: unknown;
  onEnded?: unknown;
  onError?: unknown;
  onFocus?: unknown;
  onHashChange?: unknown;
  onInput?: unknown;
  onInvalid?: unknown;
  onKeyDown?: unknown;
  onKeyPress?: unknown;
  onKeyUp?: unknown;
  onLoad?: unknown;
  onLoadedData?: unknown;
  onLoadedMetadata?: unknown;
  onLoadStart?: unknown;
  onMouseDown?: unknown;
  onMouseMove?: unknown;
  onMouseOut?: unknown;
  onMouseOver?: unknown;
  onMouseUp?: unknown;
  onMouseWheel?: unknown;
  onOffline?: unknown;
  onOnline?: unknown;
  onPageHide?: unknown;
  onPageShow?: unknown;
  onPaste?: unknown;
  onPause?: unknown;
  onPlay?: unknown;
  onPlaying?: unknown;
  onPopState?: unknown;
  onProgress?: unknown;
  onRateChange?: unknown;
  onReset?: unknown;
  onResize?: unknown;
  onScroll?: unknown;
  onSearch?: unknown;
  onSeeked?: unknown;
  onSeeking?: unknown;
  onSelect?: unknown;
  onStalled?: unknown;
  onStorage?: unknown;
  onSubmit?: unknown;
  onSuspend?: unknown;
  onTimeUpdate?: unknown;
  onToggle?: unknown;
  onUnload?: unknown;
  onVolumeChange?: unknown;
  onWaiting?: unknown;
  onWheel?: unknown;
  open?: boolean;
  optimum?: number;
  pattern?: string;
  placeholder?: string;
  popOver?: unknown;
  popOverTarget?: unknown;
  popOverTargetAction?: unknown;
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
  translate?: unknown;
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

/** Type for page layout. */
export type TStatePageLayout =
  'layout_centered_no_scroll'
  | 'layout_centered'
  | 'layout_default'
  | 'layout_md'
  | 'layout_none'
  | 'layout_none_no_appbar'
  | 'layout_sm'
  | 'layout_table_virtualized'
  | 'layout_xl'
  | 'layout_xs';

/**
 * Type for textfield adornment, e.g.
 *
 * icons and text symbol located within the textfield that serve as a type of
 * label. e.g.  
 * ```json
 * {
 *   'type': 'textfield',
 *   'name': 'machine_name',
 *   'props': {}, // Maerial-ui props
 *   'inputProps': {
 *     'start': { // IAdornment start here
 *       'icon': {},
 *       'faIcon': (),
 *        
 *     }
 *   }
 * }
 * ```
 */
export interface IAdornment {
  position?: 'start' | 'end';
  type?: 'text' | 'button';
  /** Material-UI icon */
  icon?: string;
  /** Fontawesone icon */
  faIcon?: string;
  text?: string;
  [x: string]: unknown;
}

export type TThemeMode = 'light' | 'dark';

export type TStyledImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  sx?: SxProps;
};

export type TTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  sx?: SxProps;
};
