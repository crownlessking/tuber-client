import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export interface IFormsDataArgs {
  formName: string;
  name: string;
  value: any;
}

interface IFormsDataReducerArgs {
  type: string;
  payload: IFormsDataArgs;
}

export const formsDataSlice = createSlice({
  name: 'formsData',
  initialState: initialState.formsData,
  reducers: {
    formsDataUpdate: (state, { payload }: IFormsDataReducerArgs) => {
      const { formName, name, value } = payload;
      state[formName] = state[formName] || {};
      state[formName][name] = value;
    },
    /** pass the form name to clear all form data */
    formsDataClear: (state, action) => {
      delete state[action.payload];
    },
  }
});

export const formsDataActions = formsDataSlice.actions;
export const { formsDataClear, formsDataUpdate } = formsDataSlice.actions;

export default formsDataSlice.reducer;
