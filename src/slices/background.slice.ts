import { createSlice } from '@reduxjs/toolkit';
import IStateBackground from '../interfaces/IStateBackground';
import initialState from '../state/initial.state';

interface ISBAction {
  type: string;
  payload: IStateBackground;
}

export const backgroundSlice = createSlice({
  name: 'background',
  initialState: initialState.background,
  reducers: {
    backgroundSet: (state, action: ISBAction) => {
      const { color, image, repeat } = action.payload
      state.color = color
      state.image = image
      state.repeat = repeat
    },
  },
});

export const backgroundActions = backgroundSlice.actions;
export const { backgroundSet } = backgroundSlice.actions;

export default backgroundSlice.reducer;
