import { AppDispatch } from 'src/state';
import { get_req_state } from 'src/state/net.actions';
import AbstractState from './AbstractState';
import { IJsonapiResource } from '../interfaces/IJsonapi';
import { IStateData } from '../interfaces/IState';
import State from './State';

interface IConfigure {
  dispatch?: AppDispatch,
  endpoint?: string,
}

/**
 * This class is used to get data from the `data` state.
 * It is used to get a collection or a single document in a collection.
 * It is also used to fetch data from the server.
 */
export default class StateData extends AbstractState {

  private _dataState: IStateData;
  private _parentDef?: State;
  private _reduxDispatch?: AppDispatch;
  private _endpoint?: string;
  private _currentCollection?: any[];
  private _includedProps: { id: boolean, types: boolean };

  constructor(dataState: IStateData, parent?: State) {
    super();
    this._dataState = dataState;
    this._parentDef = parent;
    this._includedProps = { id: false, types: false};
  }

  get state(): IStateData { return this._dataState; }
  get parent(): State { return this._parentDef || new State(); }
  get props(): any { return this.die('Not implemented yet.', {}); }
  get theme(): any { return this.die('Not implemented yet.', {}); }

  get noCollection(): boolean {
    return this._dataState && Object.keys(this._dataState).length === 0;
  }

  /** Enable redux dispach here if you didn't supply it when instantiating. */
  configure(opts: IConfigure): this {
    const { dispatch, endpoint } = opts;
    this._reduxDispatch = dispatch;
    this._endpoint = endpoint;
    return this;
  }

  /**
   * Retrieve a page from server.
   * [TODO] Not tested yet.
   *
   * @param page
   */
  fetch(page: number): void {
    if (!this._endpoint) {
      return this.die('StateData: Endpoint not set.', undefined);
    }
    if (this._reduxDispatch) {
      this._reduxDispatch(get_req_state(this._endpoint, `page[number]=${page}`));
    } else {
      this.die('StateData: Redux dispatch not enabled.', undefined);
    }
  }

  /**
   * Get a collection or a single document in a collection.
   * [TODO] Not tested yet.
   *
   * @param endpoint
   * @param index
   */
  getResourceById = (id: string): IJsonapiResource | null => {
    if (!this._endpoint) {
      return this.die('StateData: Endpoint not set.', null);
    }
    const collection = this._dataState[this._endpoint];
    if (!collection) {
      return null;
    }
    for (const resource of collection) {
      if (resource.id === id) {
        return resource;
      }
    }
    return null;
  }

  private getCollection = (): IJsonapiResource[] => {
    if (!this._endpoint) {
      return this.die('StateData: Endpoint not set.', []);
    }
    const collection = this._dataState[this._endpoint];
    if (!collection) {
      return this.notice(
        `StateData: '${this._endpoint}' collection not found.`,
        []
      );
    }
    return collection;
  }

   /** Include the 'id' or the 'type'. */
   include(prop: 'id' | 'types'): this {
    if (this._currentCollection) {
      return this.die('StateData: Run \'include()\' before collect().', this);
    }
    this._includedProps[prop] = true;
    return this;
  }

  /** Acquire collection from the data state. */
  collection(): this {
    if (!this._endpoint) {
      return this.die('StateData: Endpoint not set.', this);
    }
    const { id, types } = this._includedProps;
    this._currentCollection = this.getCollection().map(
      (resource: IJsonapiResource) =>
    {
      if (!id && !types) {
        return resource.attributes || {}
      } else if (id && !types) {
        return { id: resource.id, ...resource.attributes }
      } else if (!id && types) {
        return { types: resource.type, ...resource.attributes }
      } else {
        return { id: resource.id, types: resource.type, ...resource.attributes }
      }
    });
    return this;
  }

  /** Get collection */
  get<T=any>(): T[] {
    if (!this._currentCollection) {
      return this.die('StateData: Run collect() first.', []);
    }
    return this._currentCollection;
  }

  /** */
  isEmpty(): boolean {
    return this.getCollection().length === 0;
  }

  /** Delete array elements by index range. */
  rangeDelete(
    range: { startIndex: number, endIndex: number}
  ): IJsonapiResource[] {
    const { startIndex, endIndex } = range;
    const arr = this.getCollection();
    return arr.slice(0, startIndex).concat(arr.slice(endIndex + 1));
  }
}
