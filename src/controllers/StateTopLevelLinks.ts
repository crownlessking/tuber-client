import AbstractState from './AbstractState';
import IStateTopLevelLinks from '../interfaces/IStateTopLevelLinks';
import State from './State';

export default class StateTopLevelLinks extends AbstractState {

  private _parentDef?: State;
  private topLevelLinksState: IStateTopLevelLinks;

  constructor(topLevelLinksState: IStateTopLevelLinks, parent?: State) {
    super();
    this._parentDef = parent;
    this.topLevelLinksState = topLevelLinksState;
  }

  get state(): IStateTopLevelLinks { return this.topLevelLinksState; }
  get parent(): State { return this._parentDef || new State(); }
  get props(): any { return this.die('Not implemented yet.', {}); }
  get theme(): any { return this.die('Not implemented yet.', {}); }
}
