import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export const themeLightSlice = createSlice({
  name: 'themeLight',
  initialState: initialState.themeLight,
  reducers: {
    themeLightClear: (state) => {
      for (const key in state) {
        const themeOptionsKey = key as keyof typeof state;
        delete state[themeOptionsKey];
      }
    }
  }
});

export const themeLightActions = themeLightSlice.actions;
export const { themeLightClear } = themeLightSlice.actions;

export default themeLightSlice.reducer;