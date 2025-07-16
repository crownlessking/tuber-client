import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export const dialogsDarkSlice = createSlice({
  name: 'dialogsDark',
  initialState: initialState.dialogsDark,
  reducers: {
  
    dialogsDarkClear: (state) => {
      for (const key in state) {
        delete state[key];
      }
    }

  }
});

export const dialogsDarkActions = dialogsDarkSlice.actions;
export const { dialogsDarkClear } = dialogsDarkSlice.actions;

export default dialogsDarkSlice.reducer;