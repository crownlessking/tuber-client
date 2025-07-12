import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export const netSlice = createSlice({
  name: 'net',
  initialState: initialState.net,
  reducers: {
    netClear: state => {
      state.csrfTokenName = undefined;
      state.csrfTokenMethod = undefined;
      state.csrfToken = undefined;
      state.headers = undefined;
    },
    netSet: (state, { payload }) => {
      state.csrfTokenName = payload.csrfTokenName;
      state.csrfTokenMethod = payload.csrfTokenMethod;
      state.csrfToken = payload.csrfToken;
      state.headers = payload.headers;
    },
    netSetCsrfTokenName: (state, action) => {
      state.csrfTokenName = action.payload;
    },
    netSetCsrfTokenMethod: (state, action) => {
      state.csrfTokenMethod = action.payload;
    },
    netSetCsrfToken: (state, action) => {
      state.csrfToken = action.payload;
    },
    netSetHeaders: (state, action) => {
      state.headers = action.payload;
    },
  }
});

export const netActions = netSlice.actions;
export const {
  netSet,
  netClear,
  netSetCsrfToken,
  netSetCsrfTokenMethod,
  netSetCsrfTokenName,
  netSetHeaders,
} = netSlice.actions;

export default netSlice.reducer;
