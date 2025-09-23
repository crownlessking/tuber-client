import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TThemeMode } from '../common.types';
import initialState from '../state/initial.state';
import {
  APP_IS_BOOTSTRAPPED,
  APP_IS_FETCHING,
  APP_IS_READY,
  APP_REQUEST_FAILED,
  APP_REQUEST_SUCCESS,
  APP_SWITCHED_PAGE,
  APP_BROWSER_SWITCHED_PAGE
} from '../constants.client';

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState.app,
  reducers: {
    appSwitchPage: (state, action) => {
      state.lastRoute = state.route;
      state.route = action.payload;
      state.status = APP_SWITCHED_PAGE;
    },
    appBrowserSwitchPage: (state, action: PayloadAction<string>) => {
      state.lastRoute = state.route;
      state.route = action.payload;
      state.status = APP_BROWSER_SWITCHED_PAGE;
    },
    appTitleUpdate: (state, action) => {
      state.title = action.payload;
    },
    appOriginUpdate: (state, action) => {
      state.origin = action.payload;
    },
    appStatusUpdate: (state, action) => {
      state.status = action.payload;
    },
    appTaskCompleted: (state) => {
      state.status = APP_IS_READY;
    },
    appShowSpinner: (state) => {
      state.showSpinner = true;
    },
    appHideSpinner: (state) => {
      state.showSpinner = false;
    },
    appDisableSpinner: (state) => {
      state.spinnerDisabled = true;
    },
    appEnableSpinner: (state) => {
      state.spinnerDisabled = false;
    },
    appRequestStart: (state) => {
      state.status = state.fetchMessage ?? APP_IS_FETCHING;
      state.fetchMessage = undefined;
    },
    appRequestSuccess: (state) => {
      state.status = APP_REQUEST_SUCCESS;
    },
    appRequestFailed: (state) => {
      state.status = APP_REQUEST_FAILED;
    },
    appRequestEnd: (state) => {
      state.status = APP_IS_BOOTSTRAPPED;
    },
    appRequestProcessEnd: (state) => {
      state.status = APP_IS_BOOTSTRAPPED;
    },
    appSetFetchMessage: (state, actions: PayloadAction<string>) => {
      state.fetchMessage = actions.payload;
    },
    appThemeModeUpdate: (state, actions: PayloadAction<TThemeMode>) => {
      state.themeMode = actions.payload;
    },
  },
});

export const appActions = appSlice.actions;
export const {
  appHideSpinner,
  appOriginUpdate,
  appRequestEnd,
  appRequestFailed,
  appRequestProcessEnd,
  appRequestStart,
  appRequestSuccess,
  appShowSpinner,
  appDisableSpinner,
  appEnableSpinner,
  appTaskCompleted,
  appTitleUpdate,
  appSwitchPage,
  appStatusUpdate,
  appBrowserSwitchPage,
  appSetFetchMessage,
  appThemeModeUpdate,
} = appSlice.actions;

export default appSlice.reducer;
