import State from './State';
import AbstractState from './AbstractState';
import { IJsonapiError } from '../interfaces/IJsonapi';

export default class StateAllErrors extends AbstractState {

  constructor(private _allErrorsState: IJsonapiError[],
    private _parentDef?: State
  ) {
    super();
  }

  get state(): IJsonapiError[] { return this._allErrorsState; }
  /** Chain-access to root definition. */
  get parent(): State {
    return this._parentDef ?? (this._parentDef = new State());
  }
  get props(): unknown { return this.die('Not implemented yet.', {}); }
  get theme(): unknown { return this.die('Not implemented yet.', {}); }
}
