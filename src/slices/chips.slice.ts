import { createSlice } from '@reduxjs/toolkit';
import { IStateChip } from 'src/interfaces/IState';
import initialState from 'src/state/initial.state';

interface IAdd {
  type: string;
  payload: {
    route: string;
    id: string;
    chipState: IStateChip;
  };
}

interface IRemove {
  type: string;
  payload: {
    route: string;
    id: string
  };
}

export const chipsSlice = createSlice({
  name: 'chips',
  initialState: initialState.chips,
  reducers: {
    chipAdd: (state, action: IAdd) => {
      const { route, id, chipState } = action.payload;
      const pageChipsState = state[route] ?? {};
      pageChipsState[id] = chipState as any;
      state[route] = pageChipsState;
    },
    chipRemove: (state, action: IRemove) => {
      const { route, id } = action.payload;
      const pageChipsState = state[route] ?? {};
      delete pageChipsState[id];
      if (Object.keys(pageChipsState).length === 0) {
        delete state[route];
      } else {
        state[route] = pageChipsState;
      }
    },
    chipUpdate: (state, action: IAdd) => {
      const { route, id, chipState } = action.payload;
      const pageChipsState = state[route] ?? {};
      pageChipsState[id] = chipState as any;
      state[route] = pageChipsState;
    },
    chipReset: state => {
      const keys = Object.keys(state);
      for (const key of keys) {
        delete state[key];
      }
    }
  },
})

export const chipsActions = chipsSlice.actions;
export const {
  chipAdd,
  chipRemove,
  chipUpdate,
  chipReset
} = chipsSlice.actions;

export default chipsSlice.reducer;