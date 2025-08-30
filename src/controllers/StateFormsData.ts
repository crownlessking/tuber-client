import { TObj } from '../common.types';
import AbstractState from './AbstractState';
import type State from './State';

export default class StateFormsData extends AbstractState {
  private _parentDef?: State;

  constructor (private _formsDataState: TObj) {
    super();
  }

  get state(): TObj { return this._formsDataState; }
  get parent(): State | undefined { return this._parentDef; }
  get props(): TObj { return this.die<TObj>('Not implemented yet.', {}); }
  get theme(): TObj { return this.die<TObj>('Not implemented yet.', {}); }

  /**
   * Get form field value from redux store.
   * 
   * @param formName Name of the form
   * @param name Name of the field
   */
  getValue = <T>(formName: string, name: string, $default?: T): T => {
    return ((this._formsDataState[formName] as TObj<T>)?.[name] ?? $default) as T;
  }

  /**
   * Alias for `getStoredValue()`
   *
   * @param formName
   * @param name
   */
  get = <T = TObj>(formName: string): T => {
    return (this._formsDataState[formName] ?? {}) as T;
  }

}
