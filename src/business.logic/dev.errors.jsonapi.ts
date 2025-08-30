import { get_val } from '.';
import { remember_error } from './errors';
import { ler } from './logging';

/** Use when the dialogId is undefined or an empty string. */
export const e_MissingDialogKey = (registryKey: unknown): void => {
  const eMsg = 'The dialogId is undefined or an empty string:';
  ler(eMsg);
  remember_error({
    code: 'missing_dialog_key',
    title: eMsg,
    source: { pointer: `rootState.stateRegistry.${registryKey}` }
  });
};

/** Use when dialog key failed to return a dialog state. */
export const e_missingDialogState = (dialogKey: unknown): void => {
  const eMsg = `Failed to acquire dialog state using dialog key '${dialogKey}':`;
  ler(eMsg);
  remember_error({
    code: 'missing_dialog_state',
    title: eMsg,
    source: { pointer: `rootState.dialogs.${dialogKey}`}
  })
};

/** Use when dialog key failed to return a dialog (light) state. */
export const e_missingDialogLightState = (dialogKey: unknown): void => {
  const eMsg = `Failed to acquire dialog (light) state using dialog key '${dialogKey}':`;
  ler(eMsg);
  remember_error({
    code: 'missing_dialog_state',
    title: eMsg,
    source: { pointer: `rootState.dialogsLight.${dialogKey}`}
  })
};

/** Use when dialog key failed to return a dialog (dark) state. */
export const e_missingDialogDarkState = (dialogKey: unknown): void => {
  const eMsg = `Failed to acquire dialog (dark) state using dialog key '${dialogKey}':`;
  ler(eMsg);
  remember_error({
    code: 'missing_dialog_state',
    title: eMsg,
    source: { pointer: `rootState.dialogsDark.${dialogKey}`}
  })
};

/** Invalid dialogKey when creating a new bookmark from URL. @id 2 */
export const e_2 = (context: unknown): void => {
  const eMsg = `Could not find dialogKey at stateRegistry.2`;
  ler(eMsg);
  remember_error({
    code: 'value_not_found',
    title: eMsg,
    detail: 'Invalid dialogKey when creating a new bookmark from URL.',
    source: { pointer: 'rootState.stateRegistry.2' },
    meta: { 'stateRegistry': get_val(context, `stateRegistry`) }
  });
};

/** Missing value from the state registry. */
export const e_missingRegistryValue = (registryKey: unknown): void => {
  const eMsg = `Missing value at stateRegistry.${registryKey}`;
  ler(eMsg);
  remember_error({
    code: 'value_not_found',
    title: eMsg,
    source: { pointer: `rootState.stateRegistry.${registryKey}`}
  });
}