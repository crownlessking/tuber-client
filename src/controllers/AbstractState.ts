import { type TEventCallback } from '../constants.client';
import Config from '../config';

/**
 * AbstractState is the base class for all state classes.
 */
export default abstract class AbstractState {
  /**
   * Get the state.
   *
   * It contains the raw data with which this object was instantiated.
   * It's useful to use if the interface version of the object is expected or
   * a specific value could or should be undefined.
   * Whereas, with the object, values are most likely not undefined.
   */
  abstract get state(): unknown;

  /** Chain-access to parent definition. */
  abstract get parent(): unknown;

  /**
   * Use to spread properties that are valid component props on a component.
   */
  abstract get props(): unknown;

  /** Use to apply CSS styles. */
  abstract get theme(): unknown;

  /**
   * Use when it's better to throw an exception.
   * @param msg error message
   * @param $return **required** dummy default value for compatibility sake.
   */
  protected die<T=unknown>(msg: string, $return: T): T {
    if (Config.DEBUG) {
      throw new Error(msg);
    }
    return $return;
  }

  /**
   * Use when it's better to print an error message.
   * @param msg error message
   * @param $return **required** dummy default value for compatibility sake.
   */
  protected ler<T=unknown>(msg: string, $return: T): T {
    if (Config.DEBUG) {
      console.error(msg);
    }
    return $return;
  }

  /**
   * Use when it's better to print a warning message.
   * @param msg warning message
   * @param $return **required** dummy default value for compatibility sake.
   */
  protected warn<T=unknown>(msg: string, $return: T): T {
    if (Config.DEBUG) {
      console.warn(msg);
    }
    return $return;
  }

  /** 
   * Use when it's better to log a message.
   * @param msg log message
   * @param $return **required** dummy default value for compatibility sake.
   */
  protected notice<T=unknown>(msg: string, $return: T): T {
    if (Config.DEBUG) {
      console.log(msg);
    }
    return $return;
  }

  /**
   * If a callback is required for a link or button but is not defined, then this
   * method will provide a dummy one.
   */
  protected get_dud_event_callback (): TEventCallback {
    return () => {
      this.ler('No callback was assigned.', undefined);
    }
  }
}
