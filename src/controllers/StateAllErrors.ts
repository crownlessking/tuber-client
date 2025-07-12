import State from './State';
import AbstractState from './AbstractState';
import { IJsonapiError } from '../interfaces/IJsonapi';

export default class StateAllErrors extends AbstractState {

  private _parentDef?: State;
  private _allErrorsState: IJsonapiError[];

  constructor(allErrorsState: IJsonapiError[], parent?: State) {
    super();
    this._parentDef = parent;
    this._allErrorsState = allErrorsState;
  }

  get state(): IJsonapiError[] { return this._allErrorsState; }
  /** Chain-access to root definition. */
  get parent(): State { return this._parentDef || new State(); }
  get props(): any { return this.die('Not implemented yet.', {}); }
  get theme(): any { return this.die('Not implemented yet.', {}); }
}
