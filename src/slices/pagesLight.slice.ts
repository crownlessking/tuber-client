import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export const pagesLightSlice = createSlice({
  name:'pagesLight',
  initialState: initialState.pagesLight,
  reducers: {
    pagesLightClear: (state) => {
      for (const key in state) {
        delete state[key];
      }
    }
  }
});

export const pagesLightActions = pagesLightSlice.actions;
export const { pagesLightClear } = pagesLightSlice.actions;

export default pagesLightSlice.reducer;