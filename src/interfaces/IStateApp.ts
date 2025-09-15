import { TThemeMode } from '../common.types';

/**
 * App information state.
 */
export default interface IStateApp {
  /**
   * Whether the app can retrieve state from server when not available.
   * Don't forget to set your enpoints in `pathnames`.
   */
  fetchingStateAllowed?: boolean;
  /** If app is in debug mode or not. */
  inDebugMode?: boolean;
  /** If `true`, can show helpful tips. */
  inDevelMode?: boolean;
  /** Route of the page to be displayed. */
  route?: string;
  /** web page title: It will be displayed if a logo was NOT provided. */
  title?: string;
  /**
   * URL of the server to which the app will make requests and receive
   * responses.
   */
  origin?: string;
  showSpinner?: boolean;
  spinnerDisabled?: boolean;
  status?: string;
  /** Image src of appbar logo. */
  logoUri?: string;
  logoTag?: 'img' | 'div';
  /**
   * Specify image logo height.
   *
   * Highly recommended, logo will most likely not be displayed properly
   * without it.
   */
  logoHeight?: number;
  /**
   * Specify image logo width.
   *
   * Highly recommended, logo will most likely not be displayed properly
   * without it.
   */
  logoWidth?: number;
  lastRoute?: string;
  /**
   * Key of page that will be used as the home page.
   *
   * [TODO] Finish improving the default page system.
   *        I'm trying to no longer use the 'route' property to set the default
   *        page. We will use the `homePage` property instead.
   */
  homepage?: string;
  /** Indicates whether the app needs to be bootstrapped */
  isBootstrapped?: boolean;
  /** Custom fetch message  */
  fetchMessage?: string;
  /** Indicates the currently rendered theme mode */
  themeMode?: TThemeMode;
}

