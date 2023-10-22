
import { createSlice } from '@reduxjs/toolkit'
import IStateFormItem from 'src/controllers/interfaces/IStateFormItem'
import initialState from '../state/initial.state'

export interface ISliceFormsDataErrorsArgs {
  formName: string
  /** Field name */
  name: string
  /** Puts field in error status */
  error: boolean
  /** Field helper text to display */
  message?: string

  // Values copied over from form item state
  maxLength?: number,
  maxLengthMessage?: string,
  disableOnError?: boolean,
  invalidationRegex?: string,
  invalidationMessage?: string,
  validationRegex?: string,
  validationMessage?: string,
}

interface IRemove {
  formName: string
  name: string
}

interface IFormsDataErrorsReducerArgs {
  type: string
  payload: ISliceFormsDataErrorsArgs
}

interface IFormsDataErrorRemoveAction {
  type: string
  payload: IRemove
}

export function save_form_item_validation(
  errorObj: ISliceFormsDataErrorsArgs,
  state: IStateFormItem
): ISliceFormsDataErrorsArgs {
  return {
    ...errorObj,
    maxLength: state.has?.maxLength,
    maxLengthMessage: state.has?.maxLengthMessage,
    disableOnError: state.has?.disableOnError,
    invalidationRegex: state.has?.invalidationRegex,
    invalidationMessage: state.has?.invalidationMessage,
    validationRegex: state.has?.validationRegex,
    validationMessage: state.has?.validationMessage
  }
}

export const formsDataErrorsSlice = createSlice({
  name: 'formsDataErrors',
  initialState: initialState.formsDataErrors,
  reducers: {
    formsDataErrorsUpdate: (state, { payload }: IFormsDataErrorsReducerArgs) => {
      const {
        formName,
        name,
        error,
        message,
        maxLength,
        maxLengthMessage,
        disableOnError,
        invalidationRegex,
        invalidationMessage,
        validationRegex,
        validationMessage,
      } = payload
      state[formName] = state[formName] || {}
      state[formName][name] = {
        error,
        message,
        maxLength,
        maxLengthMessage,
        disableOnError,
        invalidationRegex,
        invalidationMessage,
        validationRegex,
        validationMessage
      }
    },
    /** Deletes a form error data. Payload is the form name. */
    formsDataErrorsClear: (state, action) => {
      delete state[action.payload]
    },
    /** [TODO] Does not work! */
    formsDataErrorsClearAll: (state) => {
      Object.keys(state).forEach(key => delete state[key])
    },
    /** Delete a form field error data */
    formsDataErrorsRemove: (state, { payload }: IFormsDataErrorRemoveAction) => {
      const { formName, name } = payload
      delete state[formName][name]
    }
  }
})

export const formsDataErrorsActions = formsDataErrorsSlice.actions
export const {
  formsDataErrorsClear,
  formsDataErrorsClearAll,
  formsDataErrorsUpdate,
  formsDataErrorsRemove,
} = formsDataErrorsSlice.actions

export default formsDataErrorsSlice.reducer