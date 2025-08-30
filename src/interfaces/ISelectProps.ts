
export default interface ISelectProps {
  /** If **true**, the width of the popover will automatically be set according
   * to the items inside the menu, otherwise it will be at least the width of the
   * select input.
   * @default false */
  autoWidth?: boolean;
  /** The option elements to populate the select with. Can be some **MenuItem**
   * when **native** is false and **option** when **native** is true. ⚠️The
   * **MenuItem** elements **must** be direct descendants when **native** is
   * false.
   * @type node */
  children?: unknown; // node -- The option elements to populate the select with
  /** Override or extend the styles applied to the component.
   * @see https://mui.com/material-ui/api/select/#classes
   */
  classes?: unknown;
  /** If **true**, the component is initially open. Use when the component open
   * state is not controlled (i.e. the **open** prop is not defined). You can
   * only use it when the **native** prop is **false** (default).
   * @default false */
  defaultOpen?: boolean;
  /** The default value. Use when the compoent is not controlled. */
  defaultValue?: unknown;
  /** If **true**, a value is displayed even if no items are selected. In order
   * to display a meaningful value, a function can be passed to the
   * **renderValue** prop which returns the value to be displayed when no items
   * are selected. ⚠️ When using this prop, make sure the label doesn't overlap
   * with the empty displayed value. The label should either be hidden or
   * forced to a shrunk state.
   * @default false */
  displayEmpty?: boolean;
  /** The icon that displays the arrow.
   * @type elementType
   * @default ArrowDropDownIcon
   */
  IconComponent?: unknown;
  /** The **id** of the wrapper element or the select element when **native**. */
  id?: string;
  /** An **Input** element; does not have to be a material-ui specific **Input**.
   * @type element */
  input?: unknown;
  /** An **Input** element; does not have to be a material-ui specific **Input**.
   * @type object */
  inputProps?: unknown;
  /** The label of the **input**. It is only used for layout. The actual
   * labelling is handled by **InputLabel**.
   * @see https://mui.com/material-ui/api/outlined-input/#props
   * @type node
   */
  label?: unknown;
  /** If **dense**, will adjust vertical spacing. This is normally obtained via
   * context from FormControl. The prop defaults to the value (**'none'**)
   * inherited from the parent FormControl component. */
  margin?: 'dense' | 'none';
  /** Maximum number of rows to display when multiline option is set to true. */
  maxRows?: number | string;
  /** Minimum number of rows to display when multiline option is set to true. */
  minRows?: number | string;
  /** If **true**, a TextareaAutosize element is rendered.
   * @see https://mui.com/material-ui/react-textarea-autosize/
   * @default false */
  multiline?: boolean;
  /** Name attribute of the input element. */
  name?: string;
  /** If **true**, the outline is notched to accommodate the label. */
  notched?: boolean;
  /** Callback fired when the value is changed.
   *
   * Signature:
   * ```ts
   * function(event: React.ChangeEvent) => void
   * ```
   * - event The event source of the callback. You can pull out the new value
   * by accessing event.target.value (string).
   * @type func */
  onChange?: unknown;
  /** The short hint displayed in the input before the user enters a value. */
  placeholder?: string;
  /** It prevents the user from changing the value of the field (not from
   * interacting with the field). */
  readOnly?: boolean;
  /** If **true**, the **input** element is required. The prop defaults to the
   * value (**false**) inherited from the parent FormControl component. */
  required?: boolean;
  /** Number of rows to display when multiline option is set to true. */
  rows?: number | string;
  /** The components used for each slot inside. This prop is an alias for the
   * **components** prop, which will be deprecated in the future.
   * @default {} */
  slots?: unknown;
  /** Start **InputAdornment** for this component. */
  startArdornment?: unknown;
  /** The system prop that allows defining system overrides as well as
   * additional CSS styles.
   * See the `sx` page for more details.
   * @see https://mui.com/system/getting-started/the-sx-prop/ */
  sx?: unknown;
  /** Type of the **input** element. It should be a valid HTML5 input type.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types
   */
  type?: string;
  /** The value of the **input** element, required for a controlled component. */
  value?: unknown;
}