import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';
import IStateLink from '../interfaces/IStateLink';

export const drawerSlice = createSlice({
  name: 'drawer',
  initialState: initialState.drawer,
  reducers: {
    drawerItemsUpdate: (state, action: PayloadAction<IStateLink[]>) => {
      // @ts-ignore IStateFormItemCustom property type incompatible with Redux.
      state.items = action.payload;
    },
    drawerOpen: (state) => { state.open = true; },
    drawerClose: (state) => { state.open = false; },
    drawerWidthUpdate: (state, action: PayloadAction<number>) => {
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