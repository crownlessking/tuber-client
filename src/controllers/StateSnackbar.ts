import AbstractState from './AbstractState';
import IStateAnchorOrigin from '../interfaces/IStateAnchorOrigin';
import IStateSnackbar from '../interfaces/IStateSnackbar';
import State from './State';
import StateAnchorOrigin from './StateAnchorOrigin';

export default class StateSnackbar
    extends AbstractState implements IStateSnackbar {

  private _parentDef?: State;
  private _snackbarState:  IStateSnackbar;
  private _snackbarAnchorOrigin?: StateAnchorOrigin;

  constructor(snackbarState: IStateSnackbar, parent?: State) {
    super();
    this._parentDef = parent;
    this._snackbarState = snackbarState;
  }

  get state(): IStateSnackbar { return this._snackbarState; }
  get parent(): State { return this._parentDef || new State(); }
  get props(): any { return this.die('Not implemented yet.', {}); }
  get theme(): any { return this.die('Not implemented yet.', {}); }
  get anchorOrigin(): StateAnchorOrigin {
    return this._snackbarAnchorOrigin
      || (this._snackbarAnchorOrigin = new StateAnchorOrigin(
          this.getAnchorOrigin(),
          this
        ));
  }
  get autoHideDuration(): number {
    return this._snackbarState.autoHideDuration || 6000;
  }
  get open(): boolean { return this._snackbarState.open || false; }
  get content(): JSX.Element|undefined { return this._snackbarState.content; }
  get message(): string { return this._snackbarState.message ?? ''; }
  get actions(): JSX.Element[] { return this._snackbarState.actions || []; }
  get id(): string { return this._snackbarState.id ?? ''; }
  get defaultId(): string {
    return this._snackbarState.defaultId || `message-${Date.now().toString()}`;
  }
  get type(): Required<IStateSnackbar>['type'] {
    return this._snackbarState.type || 'message';
  }
  get variant(): Required<IStateSnackbar>['variant'] {
    return this._snackbarState.variant || 'info';
  }

  /** Provides a default anchorOrigin if its not defined. */
  private getAnchorOrigin = (): IStateAnchorOrigin => {
    return this._snackbarState.anchorOrigin || {
      vertical: 'bottom',
      horizontal: 'left'
    };
  }
}
