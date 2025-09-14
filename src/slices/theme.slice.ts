import { ThemeOptions } from '@mui/material/styles/createTheme';
import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

type TThemeProps = Record<string, unknown>;
interface IThemeSetAction {
  payload: ThemeOptions;
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState: initialState.theme,
  reducers: {
    themeSet: (state, action: IThemeSetAction) => {
      for (const prop in action.payload) {
        try {
          (state as TThemeProps)[prop] = (action.payload as TThemeProps)[prop];
        } catch (e) {
          delete (state as TThemeProps)[prop];
        }
      }
    },
    themeClear: (state) => {
      for (const prop in initialState.theme) {
        try {
          (state as TThemeProps)[prop] = (initialState.theme as TThemeProps)[prop];
        } catch (e) {
          delete (state as TThemeProps)[prop];
        }
      }
    }
  }
})

export const themeActions = themeSlice.actions;
export const { themeSet } = themeSlice.actions;

export default themeSlice.reducer;
