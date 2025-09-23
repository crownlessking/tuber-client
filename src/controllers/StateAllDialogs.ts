import AbstractState from './AbstractState';
import IStateAllDialogs from '../interfaces/IStateAllDialogs';
import State from './State';
import { get_state } from '../state';

export default class StateAllDialogs extends AbstractState {

  constructor(private _allDialogsState: IStateAllDialogs,
    private _parent?: State
  ) {
    super();
  }

  get state(): IStateAllDialogs { return this._allDialogsState; }
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()));
  }
  get props(): unknown { return this.die('Not implemented yet.', {}); }
  get theme(): unknown { return this.die('Not implemented yet.', {}); }
}
