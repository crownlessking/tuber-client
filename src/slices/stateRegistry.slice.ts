import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export const stateRegistrySlice = createSlice({
  name: 'stateRegistry',
  initialState: initialState.stateRegistry,
  reducers: {
    stateRegistryClear: () => initialState.stateRegistry,

    // [TODO] No relevant actions yet

  }
});

export const stateRegistryActions = stateRegistrySlice.actions;

export default stateRegistrySlice.reducer;