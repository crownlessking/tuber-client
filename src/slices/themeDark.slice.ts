import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export const themeDarkSlice = createSlice({
  name: 'themeDark',
  initialState: initialState.themeDark,
  reducers: {
    themeDarkClear: (state) => {
      for (const key in state) {
        const themeOptionsKey = key as keyof typeof state;
        delete state[themeOptionsKey];
      }
    }
  }
});

export const themeDarkActions = themeDarkSlice.actions;
export const { themeDarkClear } = themeDarkSlice.actions;

export default themeDarkSlice.reducer;