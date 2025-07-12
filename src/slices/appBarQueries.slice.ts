import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

interface IABSSliceAction {
  type: string;
  payload: {
    route: string
    value: string
    mode?: 'search' | 'filter'
  };
}

export const appbarQueriesSlice = createSlice({
  name: 'appbarQueries',
  initialState: initialState.appbarQueries,
  reducers: {
    appbarQueriesSet: (state, action: IABSSliceAction) => {
      const { route, value, mode } = action.payload;
      state[route] = { value, mode };
    },
    appbarQueriesDelete: (state, action) => {
      delete state[action.payload];
    }
  }
});

export const appbarQueriesActions = appbarQueriesSlice.actions;
export const {
  appbarQueriesSet,
  appbarQueriesDelete
} = appbarQueriesSlice.actions;

export default appbarQueriesSlice.reducer;
