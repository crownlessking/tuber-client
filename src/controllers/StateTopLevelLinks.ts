import AbstractState from './AbstractState';
import IStateTopLevelLinks from '../interfaces/IStateTopLevelLinks';
import State from './State';

export default class StateTopLevelLinks extends AbstractState {

  constructor(private _topLevelLinksState: IStateTopLevelLinks,
    private _parentDef?: State
  ) {
    super();
  }

  get state(): IStateTopLevelLinks { return this._topLevelLinksState; }
  get parent(): State {
    return this._parentDef ?? (this._parentDef = new State());
  }
  get props(): unknown { return this.die('Not implemented yet.', {}); }
  get theme(): unknown { return this.die('Not implemented yet.', {}); }
}
