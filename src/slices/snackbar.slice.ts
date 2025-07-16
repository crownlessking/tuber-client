import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: initialState.snackbar,
  reducers: {
    snackbarAnchorOriginUpdate: (state, action) => {
      state.anchorOrigin = action.payload;
    },
    snackbarAutoHideDurationUpdate: (state, action) => {
      state.autoHideDuration = action.payload;
    },
    snackbarDefaultIdUpdate: (state, action) => {
      state.defaultId = action.payload;
    },
    snackbarTypeUpdate: (state, action) => { state.type = action.payload },
    snackbarVariantUpdate: (state, action) => {
      state.variant = action.payload;
    },
    snackbarOpen: state => { state.open = true; },
    snackbarClose: state => { state.open = false; },
    snackbarClear: state => {
      state.message = undefined;
      state.content = undefined;
      state.id      = undefined;
      state.type    = 'void';
      state.variant = 'info';
    },
    snackbarWriteInfo: (state, action) => {
      state.open = true;
      state.type = 'message';
      state.variant = 'info';
      state.message = action.payload;
    },
    snackbarWriteSuccess: (state, action) => {
      state.open = true;
      state.type = 'message';
      state.variant = 'success';
      state.message = action.payload;
    },
    snackbarWriteWarning: (state, action) => {
      state.open = true;
      state.type = 'message';
      state.variant = 'warning';
      state.message = action.payload;
    },
    snackbarWriteError: (state, action) => {
      state.open = true;
      state.type = 'message';
      state.variant = 'error';
      state.message = action.payload;
    }
  }
})

export const snackbarActions = snackbarSlice.actions;
export const {
  snackbarAnchorOriginUpdate,
  snackbarAutoHideDurationUpdate,
  snackbarDefaultIdUpdate,
  snackbarClear,
  snackbarClose,
  snackbarOpen,
  snackbarTypeUpdate,
  snackbarVariantUpdate,
  snackbarWriteError,
  snackbarWriteInfo,
  snackbarWriteSuccess,
  snackbarWriteWarning
} = snackbarSlice.actions;

export default snackbarSlice.reducer;
