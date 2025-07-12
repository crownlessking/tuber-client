
export interface IStateIconSvgPath {
  fill?: string;
  d?: string;
}

/** SVG icon data interface */
export interface IStateIcon {
  paths?: IStateIconSvgPath[];
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
  /** Icon stroke color */
  stroke?: string;
  /** Icon stroke width */
  strokeWidth?: number;
  /** Additional SVG attributes */
  attributes?: Record<string, string | number>;
}

/** Contains all icon states with SVG data. */
export default interface IStateAllIcons {
  [iconName: string]: IStateIcon;
}