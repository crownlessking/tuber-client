import AbstractState from './AbstractState';
import IStateAllDialogs from '../interfaces/IStateAllDialogs';
import State from './State';

export default class StateAllDialogs extends AbstractState {

  constructor(private _allDialogsState: IStateAllDialogs,
    private _parentDef?: State
  ) {
    super();
  }

  get state(): IStateAllDialogs { return this._allDialogsState; }
  get parent(): State {
    return this._parentDef ?? (this._parentDef = new State());
  }
  get props(): unknown {
    return this.die('Not implemented yet.', {});
  }
  get theme(): unknown {
    return this.die('Not implemented yet.', {});
  }
}
