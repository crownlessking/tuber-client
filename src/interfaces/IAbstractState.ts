import { CSSProperties } from 'react';

export default interface IAbstractState {
  /** Abstract `id`. */
  _id?: string;
  /** Abstract `name` */
  _key?: string;
  /** Abstract `type`. */
  _type?: string;
  /** Spread me on a react component. */
  props?: Record<string, unknown>;
  /** Use to apply CSS styles. */
  theme?: CSSProperties;
}