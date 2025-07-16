import { createSlice } from '@reduxjs/toolkit';
import IStateDialog from '../interfaces/IStateDialog';
import initialState from '../state/initial.state';

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState: initialState.dialog,
  reducers: {
    dialogActionUpdate: (state, action) => {
      state.actions = action.payload;
    },
    dialogTitleUpdate: (state, action) => {
      state.title = action.payload;
    },
    dialogLabelUpdate: (state, action) => {
      state.label = action.payload;
    },
    dialogContentTextUpdate: (state, action) => {
      state.contentText = action.payload;
    },
    dialogContentUpdate: (state, action) => {
      state.content = action.payload;
    },
    dialogShowActionsUpdate: (state, action) => {
      state.showActions = action.payload;
    },
    dialogOnSubmitUpdate: (state, action) => {
      state.onSubmit = action.payload;
    },
    dialogClose: (state) => {
      state.open = false;
    },
    dialogOpen: (state) => {
      state.open = true;
    },
    dialogMount: (state, action) => {
      const payload = action.payload as IStateDialog;
      state._id = payload._id;
      state.open  = payload.open;
      state._type = payload._type;
      state._key = payload._key;
      state.title = payload.title;
      state.label = payload.label;
      state.contentText = payload.contentText;
      state.content     = payload.content;
      state.actions     = payload.actions as any;
      state.showActions = payload.showActions;
      state.onSubmit    = payload.onSubmit;
      state.list        = payload.list;
      state.callback    = payload.callback;
      state.props       = payload.props;
      state.titleProps  = payload.titleProps;
      state.contentProps = payload.contentProps;
      state.contentTextProps = payload.contentTextProps;
      state.actionsProps     = payload.actionsProps;
      state.slideProps       = payload.slideProps;
    },
    dialogDismount: (state) => {
      const $default = initialState.dialog;
      state._id = $default._id;
      state.open = false;
      state._type = $default._type;
      state._key = $default._key;
      state.title = $default.title;
      state.label = $default.label;
      state.contentText = $default.contentText;
      state.content     = $default.content;
      state.actions     = $default.actions as any;
      state.showActions = $default.showActions;
      state.onSubmit    = $default.onSubmit;
      state.list        = $default.list;
      state.callback    = $default.callback;
      state.props       = $default.props;
      state.titleProps  = $default.titleProps;
      state.contentProps = $default.contentProps;
      state.contentTextProps = $default.contentTextProps;
      state.actionsProps     = $default.actionsProps;
      state.slideProps       = $default.slideProps;
    }
  }
})

export const dialogActions = dialogSlice.actions
export const {
  dialogActionUpdate,
  dialogTitleUpdate,
  dialogLabelUpdate,
  dialogOpen,
  dialogClose,
  dialogContentUpdate,
  dialogContentTextUpdate,
  dialogOnSubmitUpdate,
  dialogShowActionsUpdate,
  dialogMount,
  dialogDismount,
} = dialogSlice.actions;

export default dialogSlice.reducer;
