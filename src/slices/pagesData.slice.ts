import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';
import { TObj } from 'src/common.types';

export interface IPagesDataArgs {
  route: string;
  key:   string;
  value:  unknown;
}

interface IArgs {
  type: string;
  payload: IPagesDataArgs;
}

export const pagesDataSlice = createSlice({
  name: 'pagesData',
  initialState: initialState.pagesData,
  reducers: {
    pagesDataAdd: (state, action: IArgs) => {
      const { route, value, key } = action.payload;
      state[route] ??= {};
      (state[route] as TObj)[key] = value;
    },
    pagesDataRemove: (state, action) => {
      delete state[action.payload];
    },
  }
});

export const pagesDataActions = pagesDataSlice.actions;
export const { pagesDataAdd, pagesDataRemove } = pagesDataSlice.actions;

export default pagesDataSlice.reducer;
