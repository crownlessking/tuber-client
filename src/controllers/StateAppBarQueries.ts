import AbstractState from './AbstractState';
import {
  TStateAppbarQueries,
  IStateAppbarQuery
} from '../interfaces/IStateAppbarQueries';
import State from './State';
import { TWithRequired } from '../interfaces';

export default class StateAppbarQueries extends AbstractState {

  constructor(
    protected searchesState: TStateAppbarQueries,
    protected parentDef?: State
  ) {
    super();
  }

  get state(): TStateAppbarQueries { return this.searchesState; }
  get parent(): State { return this.parentDef || new State(); }
  get props(): any { return this.die('\'props\' not implemented yet.', {}); }
  get theme(): any { return this.die('\'theme\' not implemented yet.', {}); }

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
    const queryState =  this.searchesState[route]
      ?? this.searchesState[`/${route}`]
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