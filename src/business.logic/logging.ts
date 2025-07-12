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
 * Logs a message to the console if the app is in debug mode.
 * @param msg Message to log.
 */
export const pre = (msg?: string) => {
  if (Config.DEBUG) {
    _msgPrefix = msg ?? '';
  }
}

/**
 * Logs a message to the console if the app is in debug mode.
 * @param msg Message to log.
 */
export const log = (...args: any[]) => {
  if (Config.DEBUG) {
    console.log(_msgPrefix, ...args);
  }
}

/**
 * Logs an error message to the console if the app is in debug mode.
 * @param msg Message to log.
 */
export const ler = (...args: any[]) => {
  if (Config.DEBUG) {
    console.error(_msgPrefix, ...args);
  }
}

/**
 * Logs a warning message to the console if the app is in debug mode.
 * @param msg Message to log.
 */
export const lwr = (...args: any[]) => {
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