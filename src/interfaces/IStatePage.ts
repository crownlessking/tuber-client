import { IStatePageDrawer } from './IStateDrawer';
import IStateBackground from './IStateBackground';
import IStateComponent from './IStateComponent';
import IStateTypography from './IStateTypography';
import IStateAppbar from './IStateAppbar';
import IAbstractState from './IAbstractState';
import { IJsonapiPageLinks } from './IJsonapi';

/** Type for page layout. */
export type TStatePageLayout = 'layout_centered_no_scroll'
  | 'layout_centered'
  | 'layout_default'
  | 'layout_md'
  | 'layout_none'
  | 'layout_none_no_appbar'
  | 'layout_sm'
  | 'layout_table_virtualized'
  | 'layout_xl'
  | 'layout_xs';

/**
 * Page with content, an appbar, background, drawer... etc.
 * 
 * Example:
 * ```json
 * {
 *    "content": "<$type> : <content> : <endpoint>",
 *    "layout": "",
 *    "appbar": {},
 *    "drawer": {},
 * }
 * ```
 */
export default interface IStatePage extends IAbstractState {
  _type?: 'generic' | 'complex';
  /** Page title */
  title?: string;
  /** If set, only this value will be displayed in the browser tab. */
  forcedTitle?: string;
  /** Page appbar */
  appbar?: IStateAppbar;
  /** Page custom appbar */
  appbarCustom?: IStateComponent;
  /** Page background */
  background?: IStateBackground;
  /** Page's font color and family. */
  typography?: IStateTypography;
  /**
   * Content of page represented as a string. e.g.
   * ```ts
   * const pageJson = {
   *    'content': '<$type> : <content> : <endpoint> '
   * }
   * ```
   */
  content?: string;
  /** Page drawer */
  drawer?: IStatePageDrawer;
  /** A valid layout constant. */
  layout?: TStatePageLayout;
  /** If `true`, the current page appbar will not be rendered. */
  hideAppbar?: boolean;
  /** If `true`, the current page drawer will not be rendered. */
  hideDrawer?: boolean;
  /** If `true`, the page will use the default appbar at `IState.appbar` */
  useDefaultAppbar?: boolean;
  /** If `true`, the page will use the default drawer at `IState.drawer`. */
  useDefaultDrawer?: boolean;
  /** In mobile view, the app bar's link will be moved to the drawer. */
  generateDefaultDrawer?: boolean;
  /** If `false`, the `IState.background` will NOT be used. */
  useDefaultBackground?: boolean;
  /** If `true`, the `IState.typography` will be used. */
  useDefaultTypography?: boolean;
  /**
   * Route of a page with a valid appbar and drawer to use.
   *
   * [TODO] Check to see if this property works.
   */
  inherited?: string;
  /** Inherits the appbar of a page that has a defined appbar. */
  appbarInherited?: string;
  /** Inherits a valid custom appbar from another page  */
  appbarCustomInherited?: string;
  /** Route of another page with a valid drawer to use. */
  drawerInherited?: string;
  /** Route of another page with a valid content to use. */
  contentInherited?: string;
  /** Route of another page with a valid background to use. */
  backgroundInherited?: string;
  /** The page can retrieve or possibly store data in this field. */
  data?: Record<string, unknown>;
  /** The page can retrieve or possibly save metadata in this field. */
  meta?: Record<string, unknown>;
  /** The page can retrieve or possibly save (Jsonapi) links in this field. */
  links?: IJsonapiPageLinks;
}

/**
 * Type for the object which results from the parsing of `IStatePage.content`
 *
 * @see IStatePage
 */
export interface IStatePageContent {
  type: string;
  name: string;
  /** As of now, endpoint is for form contents.
   * It allows the usage of an automatic callback. */
  endpoint?: string;
  args?: string;
}
