import AbstractState from './AbstractState';
import {
  TStateAppbarQueries,
  IStateAppbarQuery
} from '../interfaces/IStateAppbarQueries';
import State from './State';
import { TWithRequired } from '../common.types';
import { get_state } from 'src/state';

export default class StateAppbarQueries extends AbstractState {

  constructor(protected _searchesState: TStateAppbarQueries,
    protected parentDef?: State
  ) {
    super();
  }

  get state(): TStateAppbarQueries { return this._searchesState; }
  get parent(): State {
    return this.parentDef ?? (
      this.parentDef = State.fromRootState(get_state())
    );
  }
  get props(): unknown { return this.die('\'props\' not implemented yet.', {}); }
  get theme(): unknown { return this.die('\'theme\' not implemented yet.', {}); }

  /**
   * Get a search query state.
   *
   * @param route the specified page route.
   * @returns the search query state or null if not found.
   */
  get = (route: string): TWithRequired<
    IStateAppbarQuery,
    'value'
  >|null => {
    const queryState =  this._searchesState[route]
      ?? this._searchesState[`/${route}`]
      ?? null;
    if (!queryState) return null;
    return {
      value: '',
      ...queryState
    } as TWithRequired<IStateAppbarQuery, 'value'>;
  }

  /**
   * Always get a search query state.
   *
   * @param route the specified page route.
   * @returns the search query state.
   */
  alwaysGet = (route: string): TWithRequired<
    IStateAppbarQuery,
    'value'
  > => {
    const queryState = this.get(route);
    if (!queryState) return { value: '' };
    return queryState;
  }
}