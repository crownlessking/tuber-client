
/**
 * Makes a single property optional.
 *
 * @see https://stackoverflow.com/a/61108377/1875859
 */
export type TWithOptional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/** @see https://stackoverflow.com/a/69328045/1875859 */
export type TWithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export interface IGenericObject<T=unknown> {
  [prop: string]: T;
}

export type TObj<T=unknown> = Record<string, T>;

export type TReadonly<K extends string | number | symbol, T> = {
  readonly [P in K]: T;
}

export interface IAbstractState {
  /** Abstract `id`. */
  _id?: string;
  /** Abstract `name` */
  _key?: string;
  /** Abstract `type`. */
  _type?: string;
  /** Spread me on a react component. */
  props?: Record<string, unknown>;
  /** Use to apply CSS styles. */
  theme?: Record<string, unknown>;
}

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

export type TBoolVal = 'true'
  | 'false'
  | 'on'
  | 'off'
  | 'yes'
  | 'no';

export interface IDummyEvent<T=unknown> {
  target: {
    value: T;
  };
  preventDefault: () => void;
  key: string;
}
