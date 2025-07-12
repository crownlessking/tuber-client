import AbstractState from './AbstractState';
import IStateAllDialogs from '../interfaces/IStateAllDialogs';
import State from './State';

export default class StateAllDialogs extends AbstractState {

  private _parentDef?: State;
  private _allDialogsState: IStateAllDialogs;

  constructor(allDialogsState: any, parent?: State) {
    super();
    this._parentDef = parent;
    this._allDialogsState = allDialogsState;
  }

  get state(): IStateAllDialogs { return this._allDialogsState; }
  get parent(): State { return this._parentDef || new State(); }
  get props(): any {
    return this.die('Not implemented yet.', {});
  }
  get theme(): any {
    return this.die('Not implemented yet.', {});
  }
}
