import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IStateBackground from '../interfaces/IStateBackground';
import initialState from '../state/initial.state';

export const backgroundSlice = createSlice({
  name: 'background',
  initialState: initialState.background,
  reducers: {
    backgroundSet: (state, action: PayloadAction<IStateBackground>) => {
      const { color, image, repeat } = action.payload;
      state.color = color;
      state.image = image;
      state.repeat = repeat;
    },
  },
});

export const backgroundActions = backgroundSlice.actions;
export const { backgroundSet } = backgroundSlice.actions;

export default backgroundSlice.reducer;
