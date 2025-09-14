import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

interface IAddActions {
  type: string;
  payload: {
    prop: string;
    value: unknown;
  };
}

interface IRemoveActions {
  type: string;
  payload: string;
}

export const dynamicRegistrySlice = createSlice({
  name: 'dynamicRegistry',
  initialState: initialState.dynamicRegistry,
  reducers: {
    dynamicRegistryClear: () => initialState.dynamicRegistry,
    dynamicRegistryAdd: (state, { payload: { prop, value } }: IAddActions) => {
      state[prop] = value;
    },
    dynamicRegistryRemove: (state, { payload: prop }: IRemoveActions) => {
      delete state[prop];
    }
  }
});

export const dynamicRegistryActions = dynamicRegistrySlice.actions;
export const { 
  dynamicRegistryClear,
  dynamicRegistryAdd,
  dynamicRegistryRemove
} = dynamicRegistrySlice.actions;

export default dynamicRegistrySlice.reducer;