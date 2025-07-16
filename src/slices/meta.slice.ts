import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export const metaSlice = createSlice({
  name: 'meta',
  initialState: initialState.meta,
  reducers: {
    metaAdd: (state, action) => {
      const { endpoint, meta } = action.payload;
      state[endpoint] = meta;
    },
    metaRemove: (state, action) => {
      delete state[action.payload];
    },
  },
})

export const metaActions = metaSlice.actions;
export const { metaAdd, metaRemove } = metaSlice.actions;

export default metaSlice.reducer;