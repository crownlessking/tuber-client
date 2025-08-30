import { createSlice } from '@reduxjs/toolkit';
import IStatePage from '../interfaces/IStatePage';
import initialState from '../state/initial.state';

export const PAGES_ADD = 'pages/pagesAdd';
export const PAGES_REMOVE = 'pages/pagesRemove';

export interface IPagesArgs {
  route: string;
  page: IStatePage;
}

interface IArgs {
  type: string;
  payload: IPagesArgs;
}

export const pagesSlice = createSlice({
  name:'pages',
  initialState: initialState.pages,
  reducers: {
    pagesAddMultiple: (state, action) => {
      const pages = action.payload;
      Object.keys(pages).forEach(key => {
        state[key] = pages[key];
      })
    },
    pagesAdd: (state, action: IArgs) => {
      const { route, page } = action.payload;
      /* @ts-ignore */
      state[route] = page;
    },
    pagesRemove: (state, action) => {
      delete state[action.payload];
    },
  }
});

export const pagesActions = pagesSlice.actions;
export const { pagesAddMultiple, pagesAdd, pagesRemove } = pagesSlice.actions;

export default pagesSlice.reducer;