
import StateSnackbar from './StateSnackbar';
import AbstractState from './AbstractState';
import IStateAnchorOrigin, {
  AnchorHorizontal, AnchorVertical
} from '../interfaces/IStateAnchorOrigin';

export default class StateAnchorOrigin
  extends AbstractState
  implements IStateAnchorOrigin
{
  private _parentDef: StateSnackbar;
  private _anchorOriginState: IStateAnchorOrigin;

  constructor(anchorOriginState: IStateAnchorOrigin, parent: StateSnackbar) {
    super();
    this._parentDef = parent;
    this._anchorOriginState = anchorOriginState;
  }

  get state(): IStateAnchorOrigin { return this._anchorOriginState; }
  get parent(): StateSnackbar { return this._parentDef; }
  get props(): any { return this.die('Not implemented yet.', {}); }
  get theme(): any { return this.die('Not implemented yet.', {}); }

  get vertical(): AnchorVertical { return this._anchorOriginState.vertical; }
  get horizontal(): AnchorHorizontal {
    return this._anchorOriginState.horizontal;
  }
}
