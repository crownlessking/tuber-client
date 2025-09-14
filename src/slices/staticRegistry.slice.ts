import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export const staticRegistrySlice = createSlice({
  name: 'staticRegistry',
  initialState: initialState.staticRegistry,
  reducers: {
    staticRegistryClear: () => initialState.staticRegistry,
  }
});

export const staticRegistryActions = staticRegistrySlice.actions;
export const {
  staticRegistryClear
} = staticRegistrySlice.actions;
export default staticRegistrySlice.reducer;