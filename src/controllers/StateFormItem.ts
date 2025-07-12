import AbstractState from './AbstractState';
import StateForm from './StateForm';
import {
  HTML,
  SUBMIT,
  STATE_BUTTON,
  BREAK_LINE,
  FORM_LABEL,
  FORM_HELPER_TEXT,
  BOX,
  FORM_CONTROL,
  FORM_CONTROL_LABEL,
  FORM_GROUP,
  INDETERMINATE,
  LOCALIZED,
  STACK,
  DIV
} from '../constants';
import StateFormItemCustom from './StateFormItemCustom';
import { dummy_callback, IRedux, TReduxHandle } from '../state';
import IStateFormItem from '../interfaces/IStateFormItem';
import IStateFormItemCustom from '../interfaces/IStateFormItemCustom';
import StateFormItemInputProps from './StateFormItemInputProps';
import { IFormItemDataError } from '../interfaces/IState';
import { err } from '../business.logic/logging';

export interface IFormItemHandle {
  dispatch: any;
  form: StateForm;
  input: StateFormItem;
  inputError?: IFormItemDataError;
}

export default class StateFormItem<P = StateForm, T = any>
  extends AbstractState
  implements IStateFormItem
{
  protected itemState: IStateFormItem;
  protected parentDef: P;
  protected itemHasState: IStateFormItemCustom<T>;
  protected itemHas?: StateFormItemCustom<StateFormItem<P, T>, T>;
  protected itemDisabled: boolean;
  protected itemOnClick?: TReduxHandle;
  protected itemOnFocus?: Function;
  protected itemOnChange?: Function;
  protected itemOnKeydown?: TReduxHandle;
  protected itemOnBlur?: Function;
  protected recursiveItems?: StateFormItem<P, T>[];
  protected itemInputProps?: StateFormItemInputProps<StateFormItem<P, T>>;

  constructor(itemState: IStateFormItem, parent: P) {
    super()
    this.itemState = itemState;
    this.parentDef = parent;
    this.itemDisabled = !!this.itemState.disabled;
    this.itemHasState = itemState.has || {};
  }

  get state(): IStateFormItem { return this.itemState; }
  /** Chain-access to parent object (form). */
  get parent(): P { return this.parentDef; }
  get props(): any {return this.itemState.props || {}; }
  get theme(): any { return this.itemState.theme || this.itemHasState.theme || {}; }
  get type(): Required<IStateFormItem>['type'] { return this.itemState.type ?? ''; }
  get id(): string { return this.itemState.id ?? ''; }
  /** Get the current form field name. */
  get name(): string { return this.itemState.name ?? ''; }
  /** Get the current form field custom definition. */
  get has(): StateFormItemCustom<StateFormItem<P, T>, T> {
    return this.itemHas
      || (this.itemHas = new StateFormItemCustom(
        this.itemHasState,
        this
      ));
  }
  /** Get the current form field custom definition. */
  get is(): StateFormItemCustom<StateFormItem<P, T>, T> {
    return this.itemHas
      || (this.itemHas = new StateFormItemCustom(
        this.itemHasState,
        this
      ));
  }
  get _type(): any { return this.itemState._type || {}; }
  /** Get the current form field `href` attribute. */
  get href(): string | undefined { return this.itemState.href; }
  get value(): string { return this.itemState.value; }
  /** Get human-readable text. */
  get text(): string {
    return this.itemState.label
      || this.itemHasState.label
      || this.itemHasState.title
      || this.itemHasState.text
      || this.itemState.value
      || this.itemState.name
      || '';
  }
  /** Callback to run on 'onClick' event. */
  get onFocus() {
    return this.itemOnFocus
      || (
        this.itemOnFocus = this.has.getHandleCallback('onfocus')
          || this.itemState.onFocus
          || (() => {})
      );
  }
  /** Get form field `onClick` value. */
  get onClick() {
    return this.itemOnClick
      || (
        this.itemOnClick = this.has.getHandleCallback()
          || this.itemState.onClick
          || this.has.callback
          || dummy_callback
      );
  }
  get hasNoOnClickCallback() {
    return !(this.itemState.onClick || this.itemHasState.onclickHandle);
  }
  get hasNoOnChangeCallback() {
    return !!this.itemState.onChange;
  }
  /** Callback to run on 'onChange' event. */
  get onChange(): Function {
    return this.itemOnChange
      || (
        this.itemOnChange = this.has.getHandleCallback('onchange')
          || this.itemState.onChange
          || (() => {})
      );
  }
  /** Callback to run on 'onKeyDown' event. */
  get onKeyDown() {
    return this.itemOnKeydown
      || (
        this.itemOnKeydown = this.has.getHandleCallback('onkeydown')
          || this.itemState.onKeyDown
          || (() => {})
      );
  }
  /** Callback to run on 'onBlur' event. */
  get onBlur() {
    return this.itemOnBlur
      || (
        this.itemOnBlur = this.has.getHandleCallback('onblur')
          || this.itemState.onBlur
          || (() => {})
      );
  }
  get disabled(): boolean { return this.itemDisabled; }
  get label(): string | undefined { return this.itemState.label ?? ''; }
  get language(): string | undefined { return this.itemState.highlight; }
  /** Used with a textfield. */
  get inputProps(): StateFormItemInputProps<StateFormItem<P, T>> {
    return this.itemInputProps || ( this.itemInputProps = new StateFormItemInputProps(
      this.itemState.inputProps || {},
      this
    ));
  }
  /** Must return undefined if not defined. */
  get items(): StateFormItem<P, T>[] | undefined {
    if (this.recursiveItems) {
      return this.recursiveItems;
    }
    if (this.itemState.items) {
      this.recursiveItems = (this.itemState.items as IStateFormItem[]).map(
        item => new StateFormItem(item, this.parentDef)
      );
      return this.recursiveItems;
    }
    return undefined;
  }

  /**
   * Some form items require `name` to be defined.
   */
   get nameProvided(): boolean {
    if (this.itemState.name) {
      return true;
    }
    switch (this.type.toLowerCase()) {
      case HTML:
      case SUBMIT:
      case STATE_BUTTON:
      case BREAK_LINE:
      case FORM_LABEL:
      case FORM_HELPER_TEXT:
      case BOX:
      case STACK:
      case LOCALIZED:
      case FORM_GROUP:
      case FORM_CONTROL:
      case FORM_CONTROL_LABEL:
      case INDETERMINATE:
      case DIV:
        return true;
    }
    err('`formItem.name` is NOT defined.');

    return false;
  }
  /** Use to enable the disabling of form item */
  get disableOn(): Required<IStateFormItem>['disableOn'] {
    return this.itemState.disableOn || [];
  }
  /** Use to disable item based on state. `true` means disabled. */
  get disableOnError(): boolean {
    if (this.parent instanceof StateForm) {
      const errorCount = this.parent.errorCount;
      return this.disableOn.includes('error') && errorCount > 0;
    }
    return false;
  }
  get disableOnBlur(): boolean {
    // [TODO] Implement button disabling on blur.
    return this.disableOn.includes('blur');
  }
  get disableOnClick(): boolean {
    // [TODO] Implement button disabling on click.
    return this.disableOn.includes('click');
  }
  get disableOnChange(): boolean {
    // [TODO] Implement button disabling on change.
    return this.disableOn.includes('change');
  }
  /** Disable form item (submit button) if any conditions are met. */
  get disableOnAll(): boolean {
    return this.disableOnError;
    // [TODO] When disabling on a specific event is implemented, uncomment the
    //        corresponding line below.
      // || this.disableOnBlur
      // || this.disableOnClick
      // || this.disableOnChange
  }
  /** Set form field `onClick` attribute */
  set onClick(cb: (redux: IRedux) => (e: any) => void) {
    this.itemOnClick = cb;
  }
  /** Set the 'onChange' attribute of the form field. */
  set onChange(cb: Function) {
    this.itemOnChange = cb;
  }
  /** Set the 'onKeyDown' attribute of the form field. */
  set onKeyDown(cb: TReduxHandle) {
    this.itemOnKeydown = cb;
  }
  /** Set the 'onBlur' attribute of the form field. */
  set onBlur(cb: Function) {
    this.itemOnBlur = cb;
  }
  set disabled(b: boolean) { this.itemDisabled = b; }

  /**
   * Prevents the app from throwing an exception because of the missing `name`
   * attribute in specific form item definitions.
   *
   * The application is set to throw an exception if the name of a form field is
   * missing. However, not all defined form items are fields. If the name is
   * missing from one of those definitions, the application should not throw an
   * exception.
   *
   * @deprecated
   */
  typeCheckingName = (): string => {
    const type = this.type.toLowerCase();
    if (this.itemState.name) {
      return type;
    } else {
      switch (type) {
        case HTML:
        case SUBMIT:
        case STATE_BUTTON:
        case BREAK_LINE:
        case FORM_LABEL:
        case FORM_HELPER_TEXT:
        case BOX:
        case STACK:
        case LOCALIZED:
        case FORM_GROUP:
        case FORM_CONTROL:
        case FORM_CONTROL_LABEL:
        case INDETERMINATE:
          return type;
      }
    }
    err('`formItem.name` is NOT defined.');

    return type;
  }

}
