import { IGenericObject } from '../common.types';
import AbstractState from './AbstractState';
import State from './State';

export default class StateFormsData extends AbstractState {

  private _formsDataState: IGenericObject;
  private _parentDef?: State;

  constructor (formsDataState: IGenericObject, parent?: State) {
    super();
    this._parentDef = parent;
    this._formsDataState = formsDataState;
  }

  get state(): IGenericObject { return this._formsDataState; }
  get parent(): State { return this._parentDef || new State(); }
  get props(): any { return this.die('Not implemented yet.', {}); }
  get theme(): any { return this.die('Not implemented yet.', {}); }

  /** Get form field value from redux store. */
  getValue = (formName: string, name: string): any => {
    return this._formsDataState[formName]?.[name] ?? '';
  }

  /**
   * Alias for `getStoredValue()`
   *
   * @param formName
   * @param name
   */
  get = (formName: string) => {
    return this._formsDataState[formName] ?? {};
  }

}
