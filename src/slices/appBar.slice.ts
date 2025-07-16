import { createSlice } from '@reduxjs/toolkit';
import initialState from '../state/initial.state';

export const appbarSlice = createSlice({
  name: 'appbar',
  initialState: initialState.appbar,
  reducers: {
    appbarBackgroundUpdate: (state, action) => {
      state.background = action.payload;
    },
    appbarPropsUpdate: (state, action) => {
      state.props = action.payload;
    },
    appbarToolbarPropsUpdate: (state, action) => {
      state.toolbarProps = action.payload;
    },
    appbarMenuIconPropsUpdate: (state, action) => {
      state.menuIconProps = action.payload;
    },
    appbarLogoPropsUpdate: (state, action) => {
      state.logoProps = action.payload;
    },
    appbarTextLogoPropsUpdate: (state, action) => {
      state.textLogoProps = action.payload;
    },
    appbarSearchFieldPropsUpdate: (state, action) => {
      state.searchFieldProps = action.payload;
    },
    appbarDesktopMenuItemsPropsUpdate: (state, action) => {
      state.desktopMenuItemsProps = action.payload;
    },
    appbarMobileMenuItemsPropsUpdate: (state, action) => {
      state.mobileMenuItemsProps = action.payload;
    },
    appbarMobilMenuIconPropsUpdate: (state, action) => {
      state.mobileMenuIconProps = action.payload;
    },
    appbarLogoThemeUpdate: (state, action) => {
      state.logoTheme = action.payload;
    },
    appbarBackgroundInheritedUpdate: (state, action) => {
      state.backgroundInherited = action.payload;
    },
    appbarUseDefaultBackgroundUpdate: (state, action) => {
      state.useDefaultBackground = action.payload;
    },
    appbarUseDefaultTypographyUpdate: (state, action) => {
      state.useDefaultTypography = action.payload;
    },
    appbarTypographyInheritedUpdate: (state, action) => {
      state.typographyInherited = action.payload;
    },
    appbarComponentsUpdate: (state, action) => {
      state.components = action.payload;
    },
  }
})

export const appbarActions = appbarSlice.actions;
export const {
  appbarBackgroundUpdate,
  appbarPropsUpdate,
  appbarToolbarPropsUpdate,
  appbarMenuIconPropsUpdate,
  appbarLogoPropsUpdate,
  appbarTextLogoPropsUpdate,
  appbarSearchFieldPropsUpdate,
  appbarDesktopMenuItemsPropsUpdate,
  appbarMobileMenuItemsPropsUpdate,
  appbarLogoThemeUpdate,
  appbarMobilMenuIconPropsUpdate,
  appbarBackgroundInheritedUpdate,
  appbarUseDefaultBackgroundUpdate,
  appbarUseDefaultTypographyUpdate,
  appbarTypographyInheritedUpdate,
  appbarComponentsUpdate
} = appbarSlice.actions;

export default appbarSlice.reducer;
