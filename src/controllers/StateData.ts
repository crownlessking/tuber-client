import { type AppDispatch } from 'src/state';
import { get_req_state } from 'src/state/net.actions';
import AbstractState from './AbstractState';
import {
  IJsonapiDataAttributes,
  IJsonapiResource
} from '../interfaces/IJsonapi';
import { IStateData } from '../interfaces/IState';
import State from './State';
import { TObj } from 'src/common.types';
import { get_state } from '../state';

interface IConfigure {
  dispatch?: AppDispatch;
  endpoint?: string;
}

/**
 * This class is used to get data from the `data` state.
 * It is used to get a collection or a single document in a collection.
 * It is also used to fetch data from the server.
 */
export default class StateData extends AbstractState {
  private _reduxDispatch?: AppDispatch;
  private _endpoint?: string;
  private _flattenedCollection?: IJsonapiDataAttributes[];
  private _includedProps: { id: boolean, types: boolean };

  constructor(private _dataState: IStateData,
    private _parent?: State
  ) {
    super();
    this._includedProps = { id: false, types: false };
  }

  get state(): IStateData { return this._dataState; }
  get parent(): State {
    return this._parent ?? (this._parent = State.fromRootState(get_state()));
  }
  get props(): TObj { return this.die('Not implemented yet.', {}); }
  get theme(): TObj { return this.die('Not implemented yet.', {}); }

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
  getResourceById = <T = IJsonapiDataAttributes>(id: string): IJsonapiResource<T> | null => {
    if (!this._endpoint) {
      return this.die('StateData: Endpoint not set.', null);
    }
    const collection = this._dataState[this._endpoint];
    if (!collection) {
      return null;
    }
    for (const resource of collection) {
      if (resource.id === id) {
        return resource as IJsonapiResource<T>;
      }
    }
    return null;
  }

  getResources = <T=IJsonapiDataAttributes>(): IJsonapiResource<T>[] => {
    if (!this._endpoint) {
      return this.die('StateData: Endpoint not set.', []);
    }
    const resources = this._dataState[this._endpoint];
    if (!resources) {
      return this.notice(
        `StateData: '${this._endpoint}' collection not found.`,
        []
      );
    }
    return resources as IJsonapiResource<T>[];
  }

   /** Include the 'id' or the 'type'. */
   include(prop: 'id' | 'types'): this {
    if (this._flattenedCollection) {
      return this.die('StateData: Run \'include()\' before flatten().', this);
    }
    this._includedProps[prop] = true;
    return this;
  }

  /** Merges id, type, and the attributes members. */
  flatten(): this {
    if (!this._endpoint) {
      return this.die('StateData: Endpoint not set.', this);
    }
    const { id, types } = this._includedProps;
    this._flattenedCollection = this.getResources().map(resource => {
      if (!id && !types) {
        return resource.attributes || {};
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

  /** Get flattened collection */
  get<T=IJsonapiDataAttributes>(): T[] {
    if (!this._flattenedCollection) {
      return this.die('StateData: Run flatten() first.', []);
    }
    return this._flattenedCollection as T[];
  }

  /** */
  isEmpty(): boolean {
    return this.getResources().length === 0;
  }

  /** Delete array elements by index range. */
  rangeDelete(
    range: { startIndex: number, endIndex: number}
  ): IJsonapiResource[] {
    const { startIndex, endIndex } = range;
    const arr = this.getResources();
    return arr.slice(0, startIndex).concat(arr.slice(endIndex + 1));
  }
}
