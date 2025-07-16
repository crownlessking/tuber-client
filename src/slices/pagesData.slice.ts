import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export interface IPagesDataArgs {
  route: string;
  key:   string;
  data:  any;
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
      const { route, data, key } = action.payload;
      state[route] = state[route] || {};
      state[route][key] = data;
    },
    pagesDataRemove: (state, action) => {
      delete state[action.payload];
    },
  }
});

export const pagesDataActions = pagesDataSlice.actions;
export const { pagesDataAdd, pagesDataRemove } = pagesDataSlice.actions;

export default pagesDataSlice.reducer;
