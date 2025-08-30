import IStateDrawer from './IStateDrawer';
import IStateAllDialogs from './IStateAllDialogs';
import IStateAllForms from './IStateAllForms';
import IStateAllPages from './IStateAllPages';
import IStateApp from './IStateApp';
import IStateAppbar from './IStateAppbar';
import { TStateAppbarQueries } from './IStateAppbarQueries';
import IStateBackground from './IStateBackground';
import IStateDialog from './IStateDialog';
import IStateNet from './IStateNet';
import {
  IJsonapiDataAttributes,
  IJsonapiError,
  IJsonapiResource
} from './IJsonapi';
import IStateSnackbar from './IStateSnackbar';
import IStateTopLevelLinks from './IStateTopLevelLinks';
import IStateTypography from './IStateTypography';
import IStateFormItemCustom from './IStateFormItemCustom';
import IStateAllIcons from './IStateAllIcons';
import { ThemeOptions } from '@mui/material';

/**
 * Local version of ThemeOptions. This is a simplified version for local use.
 * Extend or modify as needed to match the required shape.
 */
export interface IThemeOptionsLocal {
  palette?: {
    mode?: 'light' | 'dark';
    primary?: {
      main?: string;
    };
    secondary?: {
      main?: string;
    };
    background?: {
      default?: string;
      paper?: string;
    };
    [key: string]: unknown;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeightLight?: number;
    fontWeightRegular?: number;
    fontWeightMedium?: number;
    [key: string]: unknown;
  };
  spacing?: number | ((factor: number) => string | number);
  shape?: {
    borderRadius?: number;
    [key: string]: unknown;
  };
  components?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ILoadedPagesRange {
  first: string;
  last: string;
}

export interface IStateDataPagesRange {
  [endpoint: string]: ILoadedPagesRange | undefined;
}

export interface IStateData<T=IJsonapiDataAttributes> {
  [endpoint: string]: IJsonapiResource<T>[];
}

export interface IFormItemDataError {
  error?: boolean;
  message?: string;
  required?: boolean;
  requiredMessage?: string;
  maxLength?: number;
  maxLengthMessage?: string;
  disableOnError?: boolean;
  invalidationRegex?: string;
  invalidationMessage?: string;
  validationRegex?: string;
  validationMessage?: string;
}

export interface IStateFormsDataErrors {
  [formName: string]: {
    [name: string]: IFormItemDataError;
  }
}

export interface IStatePathnames {
  dialogs?: string;
  forms?: string;
  pages?: string;
}

/** Chip state. */
export interface IStateChip extends IStateFormItemCustom {
  /** [ **required** ] Chip id */
  id: string;
};

/** All chip states for a page stored as an object. */
export type TStateChips = Record<string, IStateChip>;
/**
 * All chip states for all pages stored as an object. e.g.
 * ```ts
 * const state: TStateAllChips = {
 *   'endpoint': {
 *     'chipId': {}
 *   }
 * };
 * ```
 */
export type TStateAllChips = Record<string, TStateChips>

/**
 * Redux store (root) state
 */
export default interface IState {
  app: IStateApp;
  appbar: IStateAppbar;
  appbarQueries: TStateAppbarQueries;
  background: IStateBackground;
  typography: IStateTypography;
  icons: IStateAllIcons;
  data: IStateData;
  /**
   * Holds the page numbers as a range in a sequential order formatted as "a-b"
   * where `a` is the first page number and `b` is the last page number.
   * e.g. `1-5` means that the pages `1`, `2`, `3`, `4`, and `5` are loaded.
   * 
   * There is a limit or a maximum number of pages that can be loaded at a time.
   * This is to prevent the app from consuming too much memory. The limit is
   * acquired from the server and is stored in the `meta` state at the
   * `max_loaded_pages` property.
   * If the limit is `5` and the user is on page `5`, then the pages range
   * will be `1-5`. If the user goes to page `6`, then the pages range will
   * be `2-6`. If the user goes to page `7`, then the pages range will be
   * `3-7`. And so on.
   * The pages range is used to determine which pages to remove from the
   * `data` state. If the pages range is `1-5` and the user goes to page `6`,
   * then the pages `1` and `2` will be removed from the `data` state.
   */
  dataPagesRange: IStateDataPagesRange;
  dialog: IStateDialog;
  dialogs: IStateAllDialogs;
  dialogsLight: IStateAllDialogs;
  dialogsDark: IStateAllDialogs;
  drawer: IStateDrawer;
  errors: IJsonapiError[];
  forms: IStateAllForms;
  formsLight: IStateAllForms;
  formsDark: IStateAllForms;
  formsData: Record<string, unknown>;
  formsDataErrors: IStateFormsDataErrors;
  meta: Record<string, unknown>;
  pages: IStateAllPages;
  pagesLight: IStateAllPages;
  pagesDark: IStateAllPages;
  pagesData: Record<string, unknown>;
  /** **Note:** The property is the page route. */
  chips: TStateAllChips;
  snackbar: IStateSnackbar;
  /**
   * Holds temporary data.
   *
   * The data must be volatile. As in, if it is retrieved, it must be removed.
   * The key names are similar to those found in other state objects. e.g.
   * If temporary data is stored for a page, the key name should end with `Page`.
   * i.e. `userPage` is a valid key. Or `newUserForm` is a valid one too. The
   * `suffix` `Form` indicates that the temporary data is stored for a form and
   * when the `newUserForm` accesses this data, it will be removed.
   */
  tmp: Record<string, unknown>;
  topLevelLinks: IStateTopLevelLinks;
  /** Material-ui `ThemeOptions` */
  theme: ThemeOptions;
  themeLight: ThemeOptions;
  themeDark: ThemeOptions;
  net: IStateNet;
  /** Get the pathnames needed to retrieve missing states. */
  pathnames: IStatePathnames;
  /** List of state keys */
  stateRegistry: Record<string, unknown>;
}

/**
 * Type for state retrieved remotely.
 *
 * It is similar to `IState` except that properties are optional to keep
 * the payload minimal.
 */
export type INetState = Partial<IState>;

/** Type for a state that defines an icon. */
export interface IStateFormItemCustomIcon extends IStateFormItemCustom {};
