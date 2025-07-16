import { createSlice } from '@reduxjs/toolkit';
import IStateAllForms from 'src/interfaces/IStateAllForms';
import IStateForm from '../interfaces/IStateForm';
import initialState from '../state/initial.state';

export const FORMS_ADD = 'forms/formsAdd';
export const FORMS_REMOVE = 'forms/formsRemove';

export interface IFormsArgs {
  name: string;
  form: IStateForm;
}

interface IFormsReducerArgs {
  type: string;
  payload: IFormsArgs;
}

interface IFormsErrorCountArgs {
  formName: string;
  errorCount: number;
}

interface IFormsErrorCountReducerArgs {
  type: string;
  payload: IFormsErrorCountArgs;
}

interface IAddMultipleAction {
  type: string;
  payload: IStateAllForms;
}

/**
 * Ensures that the form name ends with the suffix 'Form'.
 *
 * @param name
 * @returns string
 */
const _form_ = (name: string): string => {
  return name.slice(-4) === 'Form' ? name : name + 'Form';
}

export const formsSlice = createSlice({
  name:'forms',
  initialState: initialState.forms,
  reducers: {
    formsAddMultiple: (state, action:IAddMultipleAction) => {
      const forms = action.payload;
      Object.keys(forms).forEach(key => {
        state[key] = forms[key] as any;
      });
    },
    formsAdd: (state, action: IFormsReducerArgs) => {
      const { name, form } = action.payload;
      state[_form_(name)] = form as any;
    },
    formsRemove: (state, action) => {
      state[action.payload] = {};
    },
    errorCountSet: (state, action: IFormsErrorCountReducerArgs) => {
      const { formName, errorCount } = action.payload;
      state[formName].errorCount = errorCount;
    }
  }
});

export const formsActions = formsSlice.actions;
export const {
  formsAddMultiple,
  formsAdd,
  formsRemove,
  errorCountSet
} = formsSlice.actions;

export default formsSlice.reducer;
