import { get_state_form_name } from 'src/business.logic';
import { e_missingRegistryValue } from 'src/business.logic/dev.errors.jsonapi';
import { remember_error } from 'src/business.logic/errors';
import { ler, pre } from 'src/business.logic/logging';
import { get_parsed_content } from 'src/controllers';
import FormValidationPolicy from 'src/controllers/FormValidationPolicy';
import { StateRegistry } from 'src/controllers/StateRegistry';
import { type IRedux, type RootState } from 'src/state';

interface IFormData<T=unknown> {
  formData: T;
  formName: string;
}

/** An attempt to reduce inflated code when retrieving state registry values. */
export const get_registry_val = (
  rootState: RootState,
  registryKey: string
): string | undefined => {
  const value = new StateRegistry(rootState.stateRegistry).get(registryKey);
  if (typeof value !== 'string' || value === '') {
    e_missingRegistryValue(registryKey);
  }
  return value as string | undefined;
}

/**
 * Returns the endpoint for the form in the dialog.  
 * __Note:__ The dialog state must already be in the redux store.
 * @param rootState The redux store.
 * @returns endpoint
 */
export function get_dialog_form_endpoint(
  rootState: RootState,
  dialogRegistryKey: string
): string | undefined {
  pre('get_dialog_form_endpoint():');
  const dialogKey = get_registry_val(rootState, dialogRegistryKey);
  if (!dialogKey) { return; }
  const dialogState = rootState.dialogs[dialogKey];
  if (!dialogState) {
    const errorMsg = `'${dialogKey}' does not exist.`;
    ler(errorMsg);
    remember_error({
      code: 'value_not_found',
      title: errorMsg,
      source: { parameter: 'dialogKey' }
    });
    return;
  }
  const endpoint = get_parsed_content(dialogState.content).endpoint;
  if (!endpoint) {
    const errorMsg = `No endpoint defined for '${dialogKey}'.`;
    ler(errorMsg);
    remember_error({
      code: 'value_not_found',
      title: errorMsg,
      source: { parameter: 'endpoint' }
    });
    return;
  }
  pre();
  return endpoint;
}

/**
 * Returns the form data for the form in the dialog.  
 * __Note:__ The dialog state must already be in the redux store.
 * @param redux The redux store.
 * @param formId The form id.
 * @returns form data and form name
 */
export function get_form_data<T=unknown>(
  redux: IRedux,
  formId: string
): IFormData<T> | null {
  const rootState = redux.store.getState();
  pre('get_form_data():');
  const formKey = get_registry_val(rootState, formId);
  if (!formKey) { return null; }
  const formName = get_state_form_name(formKey);
  if (!rootState.formsData[formName]) {
    const errorMsg = `'${formKey}' data not found.`;
    ler(errorMsg);
    remember_error({
      code: 'value_not_found',
      title: errorMsg,
      source: { parameter: 'formData' }
    });
    return null;
  }
  pre();
  const policy = new FormValidationPolicy<T>(redux, formName);
  const validation = policy.getValidationSchemes();
  if (validation && validation.length > 0) {
    validation.forEach(vError => {
      const message = vError.message ?? '';
      policy.emit(vError.name, message);
    });
    return null;
  }
  const formData = policy.getFilteredData();
  return { formData, formName };
}

/**
 * Converts a string to a slug.
 *
 * @param str string to convert to slug
 * @returns slug
 */
export const to_slug = (str: string) => str
  .replace(/\s+/g, '-')
  .replace(/[^A-Za-z0-9-]+/g, '')
  .toLowerCase();

/** Convert a slug to a string. */
export const from_slug = (slug: string) => 
  decodeURIComponent(slug.replace(/\+|-/g, '%20'))
  .toLowerCase();
