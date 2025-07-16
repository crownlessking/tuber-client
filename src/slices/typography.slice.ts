import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export const typographySlice = createSlice({
  name: 'typography',
  initialState: initialState.typography,
  reducers: {
    typographySet: (state, action) => {
      const { fontFamily, color } = action.payload;
      state.fontFamily = fontFamily;
      state.color = color;
    },
  }
})

export const typographyActions = typographySlice.actions;
export const { typographySet } = typographySlice.actions;

export default typographySlice.reducer;
