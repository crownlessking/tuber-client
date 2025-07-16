import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export interface ITmpArgs {
  id: string;
  name: string;
  value: any;
}

interface ITmpReducerArgs {
  type: string;
  payload: ITmpArgs;
}

export const tmpSlice = createSlice({
  name: 'tmp',
  initialState: initialState.tmp,
  reducers: {
    tmpAdd: (state, action: ITmpReducerArgs) => {
      const { id, name, value } = action.payload;
      state[id] = state[id] || {};
      state[id][name] = value;
    },
    tmpRemove: (state, action) => {
      delete state[action.payload];
    },
  }
})

export const tmpActions = tmpSlice.actions;
export const { tmpAdd, tmpRemove } = tmpSlice.actions;

export default tmpSlice.reducer;
