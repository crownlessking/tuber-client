
export default interface IStateAvatar {
  icon?: string;
  faIcon?: string;
  /** Don't use more than two letters. */
  text?: string;
  /** Spread me on an avatar component */
  props?: {
    /**
     * Used in combination with src or srcSet to provide an alt attribute for the
     * rendered img element.
     */
    alt?: string;
    /**
     * Used to render icon or text elements inside the Avatar if src is not set.
     * This can be an element, or just a string.
     */
    children?: any;
    /**
     * Override or extend the styles applied to the component. See CSS API below
     * for more details.
     */
    classes?: Record<string, string>;
    /**
     * The component used for the root node. Either a string to use a HTML
     * element or a component.
     */
    component?: string | JSX.Element;
    /**
     * Attributes applied to the img element if the component is used to display
     * an image. It can be used to listen for the loading error event.
     */
    imgProps?: any;
    /**
     * The sizes attribute for the img element.
     */
    sizes?: string;
    /**
     * The src attribute for the img element.
     */
    src?: string;
    /**
     * The srcSet attribute for the img element. Use this attribute for
     * responsive image display.
     */
    srcSet?: string;
    /**
     * The system prop that allows defining system overrides as well as 
     * additional CSS styles. See the `sx` page for more details.
     */
    sx?: any;
    /**
     * The shape of the avatar.
     */
    variant?: 'circular'|'rounded'|'square'|'string';

    [prop: string]: any;
  }
}
