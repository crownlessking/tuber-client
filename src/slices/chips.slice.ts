import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStateChip } from '../interfaces/IState';
import initialState from '../state/initial.state';

interface IAdd {
  route: string;
  id: string;
  chipState: IStateChip;
}

interface IRemove {
  route: string;
  id: string;
}

export const chipsSlice = createSlice({
  name: 'chips',
  initialState: initialState.chips,
  reducers: {
    chipAdd: (state, action: PayloadAction<IAdd>) => {
      const { route, id, chipState } = action.payload;
      const pageChipsState = state[route] ?? {};
      // @ts-ignore
      pageChipsState[id] = chipState;
      state[route] = pageChipsState;
    },
    chipRemove: (state, action: PayloadAction<IRemove>) => {
      const { route, id } = action.payload;
      const pageChipsState = state[route] ?? {};
      delete pageChipsState[id];
      if (Object.keys(pageChipsState).length === 0) {
        delete state[route];
      } else {
        state[route] = pageChipsState;
      }
    },
    chipUpdate: (state, action: PayloadAction<IAdd>) => {
      const { route, id, chipState } = action.payload;
      const pageChipsState = state[route] ?? {};
      // @ts-ignore
      pageChipsState[id] = chipState;
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