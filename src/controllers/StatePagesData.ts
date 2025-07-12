import { IGenericObject } from '../common.types';
import AbstractState from './AbstractState';
import State from './State';

/**
 * This class is a wrapper for the pages data JSON object.
 */
export default class StatePagesData extends AbstractState {
  private _parentDef?: State;
  private _pagesDataState: IGenericObject;

  constructor(pagesDataState: IGenericObject, parent?: State) {
    super();
    this._parentDef = parent;
    this._pagesDataState = pagesDataState;
  }

  get state(): IGenericObject { return this._pagesDataState; }
  /** Chain-access to the root definition. */
  get parent(): State { return this._parentDef || new State(); }
  get props(): any { return this.die('Not implemented yet.', {}); }
  get theme(): any { return this.die('Not implemented yet.', {}); }
}
