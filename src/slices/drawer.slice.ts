import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export const drawerSlice = createSlice({
  name: 'drawer',
  initialState: initialState.drawer,
  reducers: {
    drawerItemsUpdate: (state, action) => {
      state.items = action.payload
    },
    drawerOpen: (state) => {
      state.open = true
    },
    drawerClose: (state) => {
      state.open = false
    },
    drawerWidthUpdate: (state, action) => {
      state.width = action.payload
    },
  },
});

export const drawerActions = drawerSlice.actions;
export const {
  drawerClose,
  drawerItemsUpdate,
  drawerOpen,
  drawerWidthUpdate
} = drawerSlice.actions;

export default drawerSlice.reducer;