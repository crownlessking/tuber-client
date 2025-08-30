import { TObj } from '../common.types';
import AbstractState from './AbstractState';
import State from './State';

interface IConfigure {
  endpoint?: string;
}

/**
 * This class is a wrapper for the pages data JSON object.
 */
export default class StatePagesData extends AbstractState {
  private _parentDef?: State;
  private _pagesDataState: TObj;
  private _endpoint?: string;

  constructor(pagesDataState: TObj, parent?: State) {
    super();
    this._parentDef = parent;
    this._pagesDataState = pagesDataState;
  }

  get state(): TObj { return this._pagesDataState; }
  /** Chain-access to the root definition. */
  get parent(): State { return this._parentDef || new State(); }
  get props(): TObj { return this.die('Not implemented yet.', {}); }
  get theme(): TObj { return this.die('Not implemented yet.', {}); }

  configure(opts: IConfigure): this {
    const { endpoint } = opts;
    this._endpoint = endpoint;

    return this;
  }

  get<T=unknown>(key: string): T {
    if (!this._endpoint) {
      throw new Error('Endpoint must be configured to access page data.');
    }
    return (this._pagesDataState[this._endpoint] as TObj<T>)[key];
  };
}
