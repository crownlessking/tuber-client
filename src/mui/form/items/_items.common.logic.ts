import { log } from '../../../business.logic/logging';
import { remember_exception } from '../../../business.logic/errors';
import IStateFormItem from '../../../interfaces/IStateFormItem';

/**
 * To be used with a multiple checkboxes component.
 * It contains the boolean values needed to check the appropriate boxes.
 */
export interface ICheckboxesStatus {
  [name: string]: boolean;
}

export interface ICheckboxesData {
  checkedValues: string[];
  value: string;
  checked: boolean;
  statuses: ICheckboxesStatus;
}

/**
 * Get form field value form the redux store.
 *
 * @param storeValues 
 * @param formName 
 * @param name 
 * @param $default 
 * @returns 
 */
export function get_redux_store_val<T=any>(
  storeValues: any,
  formName: string,
  name: string,
  $default: T
): T {
  try {
    const val = storeValues[formName][name] || $default;
    return val;
  } catch (e) { remember_exception(e); }
  return $default;
}

/**
 * Get form field value from redux store.
 *
 * Also sets the form fields default value if specified in the from definition.
 *
 * @param that
 * @param def
 * @deprecated
 */
export function get_field_value(
  formsData: any,
  formName: string,
  name: string
) {
  try {
    return formsData[formName]?.[name] ?? '';
  } catch (e) { remember_exception(e); }
  return '';
}

/**
 * A version of the `getStoredValue()` function. It works with local a state
 * instead of the redux store.
 *
 * If no value is found in the state, will return the field definition's
 * default value if possible.
 *
 * @param formData
 * @param name
 *
 * @depecated
 */
export function get_locally_stored_value(formData: any, item: IStateFormItem): any {
  const copyItem = { ...item };
  const { name } = copyItem;
  copyItem.has = copyItem.has || { };
  const { defaultValue } = copyItem.has;
  return (name && formData[name] !== undefined)
    ? formData[name]
    : (copyItem.value || (defaultValue ?? ''));
}

/**
 * Converts the data of checkboxes to an array of checked values. e.g. The
 * array will only contain the checkbox values that are checked.
 *
 * It also takes a previous array of checked values and updates it with the
 * forms currently checked values.
 *
 * @param cb
 */
export function update_checkboxes(cb: ICheckboxesData): void {
  cb.checkedValues = [ ...cb.checkedValues ];
  const valueIndex = cb.checkedValues.indexOf(cb.value);
  const containsValue = (valueIndex >= 0);
  if (containsValue && !cb.checked) {
    cb.checkedValues.splice(valueIndex, 1);
    cb.statuses[cb.value] = false;
  } else if (!containsValue && cb.checked) {
    cb.checkedValues.push(cb.value);
    cb.statuses[cb.value] = true;
  }
}

export function get_statuses(values: string[]): ICheckboxesData['statuses'] {
  const statuses: {[name: string]: boolean} = {};
  values.map(value => statuses[value] = true);
  return statuses;
}

export function update_switches_statuses(cb: ICheckboxesData): void {
  const statuses: {[name: string]: boolean} = {};
  cb.checkedValues.map(value => statuses[value] = true);
  cb.statuses = statuses;
}

export function get_meta(stateMeta: any, endpoint: string, key?: string): any {
  try {
    return key ? stateMeta[endpoint][key] : stateMeta[endpoint];
  } catch (e) {
    const message = `get_meta: meta['${endpoint}']['${key}'] does NOT exist.`;
    log(message);
    remember_exception(e, message);
  }
}

/** Increment or decrement total errors based on old and new error state */
export function inc_decr_error_count(old: boolean, $new: boolean): number {
  if (old === false && $new === true) {
    return 1;
  } else if (old === true && $new === false) {
    return -1;
  }
  return 0;
}
