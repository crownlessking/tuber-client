
export interface IStateIconElement {
  type: 'path' | 'rect' | 'polygon' | 'group';
  props: IStateIconPath | IStateIconRect | IStateIconPolygon | IStateIconGroup;
}

export interface IStateIconGroupAttributes {
  transform?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  className?: string;
}

export interface IStateIconGroup extends IStateIconGroupAttributes {
  children: IStateIconElement[];
}

export interface IStateIconPath {
  fill?: string;
  d?: string;
  opacity?: number;
}

export interface IStateIconPolygon {
  points?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  transform?: string;
}

export interface IStateIconRect {
  fill?: string;
  height?: number;
  width?: number;
  x?: number;
  y?: number;
  rx?: number;
  ry?: number;
}

/** SVG icon data interface */
export default interface IStateIcon {
  paths?: IStateIconPath[];
  groups?: IStateIconGroup[];
  /** SVG path data or full SVG content */
  svg?: string;
  /** Icon viewBox attribute (default: "0 0 24 24") */
  viewBox?: string;
  /** Icon width (default: 24) */
  width?: number;
  /** Icon height (default: 24) */
  height?: number;
  /** Icon fill color */
  fill?: string;
  opacity?: number;
  /** Icon stroke color */
  stroke?: string;
  /** Icon stroke width */
  strokeWidth?: number;
  /** Additional SVG attributes */
  attributes?: Record<string, string | number>;
  enableBackground?: string;
  rects?: IStateIconRect[];
  polygons?: IStateIconPolygon[];
  baseProfile?: 'full' | 'basic' | 'tiny';
}
