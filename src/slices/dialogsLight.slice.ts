import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export const dialogsLightSlice = createSlice({
  name: 'dialogsLight',
  initialState: initialState.dialogsLight,
  reducers: {

    dialogsLightClear: (state) => {
      for (const key in state) {
        delete state[key];
      }
    }

  }
});

export const dialogsLightActions = dialogsLightSlice.actions;
export const { dialogsLightClear } = dialogsLightSlice.actions;

export default dialogsLightSlice.reducer;