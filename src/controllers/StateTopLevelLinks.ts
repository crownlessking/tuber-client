import AbstractState from './AbstractState';
import IStateTopLevelLinks from '../interfaces/IStateTopLevelLinks';
import State from './State';
import { get_state } from '../state';

export default class StateTopLevelLinks extends AbstractState {

  constructor(private _topLevelLinksState: IStateTopLevelLinks,
    private _parent?: State
  ) {
    super();
  }

  get state(): IStateTopLevelLinks { return this._topLevelLinksState; }
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()));
  }
  get props(): unknown { return this.die('Not implemented yet.', {}); }
  get theme(): unknown { return this.die('Not implemented yet.', {}); }
}
