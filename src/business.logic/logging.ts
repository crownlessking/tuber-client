import Config from '../config';

/** Helps to shorten error message */
let _msgPrefix = '';

/**
 * Prepends message prefix.
 * @param msg Message to prepend.
 */
export const msg = (msg: string): string => {
  return _msgPrefix + msg;
}

/**
 * Set a message prefix for all subsequently console messages printed using one
 * of the other logging functions.
 * @param prefix prefix message.
 */
export const pre = (prefix?: string) => {
  if (Config.DEBUG) {
    _msgPrefix = prefix ?? '';
  }
}

/**
 * Logs a message to the console if the app is in debug mode.
 * @param msg Message to log.
 */
export const log = (...args: unknown[]) => {
  if (Config.DEBUG) {
    console.log(_msgPrefix, ...args);
  }
}

/**
 * Logs an error message to the console if the app is in debug mode.
 * @param msg Message to log.
 */
export const ler = (...args: unknown[]) => {
  if (Config.DEBUG) {
    console.error(_msgPrefix, ...args);
  }
}

/**
 * Logs a warning message to the console if the app is in debug mode.
 * @param msg Message to log.
 */
export const lwr = (...args: unknown[]) => {
  if (Config.DEBUG) {
    console.warn(_msgPrefix, ...args);
  }
}

/**
 * Throws an exception if the app is in debug mode.
 * @param msg Message to log.
 */
export const err = (msg: string) => {
  if (Config.DEBUG) {
    throw new Error(`${_msgPrefix}${msg}`);
  }
}