import { CSSProperties } from 'react';

/**
 * Background color, image, gradient... etc. Any valid CSS background.
 */
export default interface IStateBackground {
  /** Value for the CSS `backgroun-color` property. */
  color?: string;
  /** CSS url or gradient functions */
  image?: string;
  repeat?: CSSProperties['backgroundRepeat'];
}
