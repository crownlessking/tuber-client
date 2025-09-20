import AbstractState from './AbstractState';
import { IStatePathnames } from '../interfaces/IState';
import State from './State';
import { get_state } from '../state';

export default class StatePathnames extends AbstractState {
  constructor(private _pathnamesState: IStatePathnames,
    private _parent?: State
  ) {
    super();
  }
  get state(): IStatePathnames { return this._pathnamesState; }
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()));
  }
  get props(): {} { return this.die('Method not implemented.', {}); }
  get theme(): {} { return this.die('Method not implemented.', {}); }

  get DIALOGS(): string { return this.state.dialogs ?? 'state/dialogs'; }
  get FORMS(): string { return this.state.forms ?? 'state/forms'; }
  get PAGES(): string { return this.state.pages ?? 'state/pages'; }
}