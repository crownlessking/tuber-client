import { createSlice } from '@reduxjs/toolkit';
import { IJsonapiResource } from '../interfaces/IJsonapi';
import initialState from '../state/initial.state';

export interface IDataAdd {
  type: string;
  payload: {
    /** Collection of resources retrieved from server. */
    data: any
    /** The endpoint at which the collection was retrieved. */
    endpoint: string
  };
}

export interface ICollectionRemove {
  type: string;
  payload: string;
}

export interface ICollectionStore {
  type: string;
  payload: {
    /** Collection of resources retrieved from server. */
    collection: IJsonapiResource<any>[];
    /** The endpoint at which the collection was retrieved. */
    endpoint: string;
  };
}

export interface ICollectionLimitedStore {
  type: string;
  payload: {
    /** Collection of resources retrieved from server. */
    collection: IJsonapiResource<any>[];
    /** The endpoint at which the collection was retrieved. */
    endpoint: string;
    /** Maximum number of resources per page. */
    pageSize: number;
        /** The maximum number of pages to be loaded. */
    limit: number;
  };
}

export interface IMemberEditActionPayload {
  endpoint: string;
  index?: number;
  prop: string;
  val: any;
}

export interface IMemberEditAction {
  type: string;
  payload: IMemberEditActionPayload;
}

export interface IDataResourceUpdate {
  type: string;
  payload: {
    endpoint: string;
    index: number;
    resource: IJsonapiResource<any>;
  }
}

export interface IDataDeleteByIndex {
  type: string;
  payload: {
    endpoint: string;
    index: number;
  }
}

export const dataSlice = createSlice({
  name: 'data',
  initialState: initialState.data,
  reducers: {
    /** Insert array element at the beginning */
    dataStack: (state, action: IDataAdd) => {
      const { endpoint, data } = action.payload;
      const newArray = state[endpoint] || [];
      newArray.unshift(data);
      state[endpoint] = newArray;
    },

    /** Stores a collection but replaces existing */
    dataStoreCol: (state, action: ICollectionStore) => {
      const { endpoint, collection } = action.payload;
      state[endpoint] = collection;
    },
    /** Store a collection by accumulation */
    dataQueueCol: (state, action: ICollectionStore) => {
      const { endpoint, collection } = action.payload;
      state[endpoint] = (state[endpoint] || []).concat(collection);
    },
    dataStackCol: (state, action: ICollectionStore) => {
      const { endpoint, collection } = action.payload;
      state[endpoint] = collection.concat(state[endpoint] || []);
    },
    dataLimitQueueCol: (state, action: ICollectionLimitedStore) => {
      const { endpoint, collection, pageSize, limit } = action.payload;
      let arr = state[endpoint] || [];
      const totalPage = Math.ceil(arr.length / pageSize);
      if (totalPage > limit) {
        arr = arr.slice(pageSize);
      }
      state[endpoint] = arr.concat(collection);
    },
    dataLimitStackCol: (state, action: ICollectionLimitedStore) => {
      const { endpoint, collection, pageSize, limit } = action.payload;
      let arr = state[endpoint] ?? [];
      const totalPage = Math.ceil(arr.length / pageSize);
      if (totalPage > limit) {
        const dropSize = limit * pageSize - arr.length;
        arr = arr.slice(0, dropSize);
      }
      state[endpoint] = collection.concat(arr);
    },
    /** Deletes a collection. */
    dataRemoveCol: (state, action: ICollectionRemove) => {
      state[action.payload] = [];
    },
    /** Save changes to a single resouce. */
    dataUpdateByIndex: (state, action: IDataResourceUpdate) => {
      const { endpoint, index, resource } = action.payload;
      state[endpoint] = state[endpoint] || [];
      state[endpoint][index] = resource;
    },
    /** Delete resource by index. */
    dataDeleteByIndex: (state, action: IDataDeleteByIndex) => {
      const { endpoint, index } = action.payload;
      state[endpoint] = state[endpoint] || [];
      state[endpoint].splice(index, 1);
    },
    /** Modifies a single data member. */
    dataSetAttrByIndex: (state, action: IMemberEditAction) => {
      const { endpoint, index, prop, val } = action.payload;
      if (index) {
        state[endpoint][index].attributes[prop] = val;
      }
    },
    dataUpdateByName: (state, action: {
      type: string
      payload: {
        collectionName: string
        name: string
        resource: IJsonapiResource<any>
      }
    }) => {
      const { collectionName, name, resource } = action.payload;
      const collection = state[collectionName]
        ?? [] as IJsonapiResource[];
      for (let i = 0; i < collection.length; i++) {
        if (collection[i].attributes.name === name) {
          collection[i] = resource;
          break;
        }
      }
      state[collectionName] = collection;
    },
    dataUpdateById: (state, action: {
      type: string;
      payload: {
        collectionName: string;
        id: string;
        resource: IJsonapiResource<any>;
      };
    }) => {
      const { collectionName, id, resource } = action.payload;
      const collection = state[collectionName]
        ?? [] as IJsonapiResource[];
      for (let i = 0; i < collection.length; i++) {
        if (collection[i].id === id) {
          collection[i] = resource;
          break;
        }
      }
      collection.push(resource);
      state[collectionName] = collection;
    }
  }
})

export const dataActions = dataSlice.actions;
export const {
  dataStack,
  dataStoreCol,
  dataQueueCol,
  dataLimitQueueCol,
  dataStackCol,
  dataLimitStackCol,
  dataRemoveCol,
  dataUpdateByIndex,
  dataDeleteByIndex,
  dataSetAttrByIndex,
  dataUpdateByName
} = dataSlice.actions;

export default dataSlice.reducer;
