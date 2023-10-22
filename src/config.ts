
import getConfig, { IConfiguration } from './controllers/config.controller'
import store from './state'

let msg_prefix = ''

const initConfObj = {

  /** Whether the app is in debugging mode or not. */
  DEBUG: store.getState().app.inDebugMode ?? false,

  /** Whether the app is in production mode or not. */
  PROD: !store.getState().app.inDebugMode ?? false,

  /** If `true`, will show tips in console. */
  DEV: store.getState().app.inDevelMode ?? false,

  /**
   * Limits the number of time the app attempts to load a page state from the
   * server if none was defined.
   *
   * **Warning:** This fixes a bug where the app infinitely attempts to load
   * state from server.
   */
  ALLOWED_ATTEMPTS: 1,

  /** Log to console if in debug mode. */
  log: (args: any): void => {
    if (initConfObj.DEBUG) {
      console.log(msg_prefix, ...args)
    }
  },
  /** Log a warning to console if in debug mode. */
  warn: (args: any): void => {
    if (initConfObj.DEBUG) {
      console.warn(msg_prefix, ...args)
    }
  },
  /** Log an error to console if in debug mode. */
  ler: (args: any): void => {
    if (initConfObj.DEBUG) {
      console.error(msg_prefix, ...args)
    }
  },
  /**
   * Insert prefix to help keep messages short.  
   * Works with `log()`, `warn()`, `ler()`, `msg()`.
   */
  pre: (prefix: string): void => {msg_prefix = prefix},
  /** Insert prefix to help keep messages short. */
  msg: (msg: string): string => `${msg_prefix}${msg}`,
}

const Config = getConfig()
Config.init(initConfObj)

// Makes config object key available in suggestions
export type IAppConfig = IConfiguration & typeof initConfObj

export default Config as IAppConfig
