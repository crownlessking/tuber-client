import { IStatePageDrawer } from './IStateDrawer'
import IStateAppBar from './IStateAppBar'
import IStateBackground from './IStateBackground'
import IStateComponent from './IStateComponent'
import IStateTypography from './IStateTypography'
import { TStatePageLayout } from '../../constants'
import IAbstractState from './IAbstractState'
import { IGenericObject } from './IState'

/**
 * Page with content, an appbar, background, drawer... etc.
 * 
 * Example:
 * ```json
 * {
 *    "content": "<$type> : <content> : <endpoint>",
 *    "layout": "",
 *    "appBar": {},
 *    "drawer": {},
 * }
 * ```
 */
export default interface IStatePage extends IAbstractState {
  _type?: 'generic' | 'complex'
  /** Page title */
  title?: string
  /** If set, only this value will be displayed in the browser tab. */
  forcedTitle?: string
  /** Page appBar */
  appBar?: IStateAppBar
  /** Page custom appBar */
  appBarCustom?: IStateComponent
  /** Page background */
  background?: IStateBackground
  /** Page's font color and family. */
  typography?: IStateTypography
  /**
   * Content of page represented as a string. e.g.
   * ```ts
   * const pageJson = {
   *    'content': '<$type> : <content> : <endpoint> '
   * }
   * ```
   */
  content?: string
  /** Page drawer */
  drawer?: IStatePageDrawer
  /** A valid layout constant. */
  layout?: TStatePageLayout
  /** If `true`, the current page appbar will not be rendered. */
  hideAppbar?: boolean
  /** If `true`, the current page drawer will not be rendered. */
  hideDrawer?: boolean
  /** If `true`, the page will use the default appBar at `IState.appBar` */
  useDefaultAppbar?: boolean
  /** If `true`, the page will use the default drawer at `IState.drawer`. */
  useDefaultDrawer?: boolean
  /** In mobile view, the app bar's link will be moved to the drawer. */
  generateDefaultDrawer?: boolean
  /** If `false`, the `IState.background` will NOT be used. */
  useDefaultBackground?: boolean
  /** If `true`, the `IState.typography` will be used. */
  useDefaultTypography?: boolean
  /**
   * Route of a page with a valid appBar and drawer to use.
   *
   * [TODO] Check to see if this property works.
   */
  inherited?: string
  /** Inherits the appBar of a page that has a defined appBar. */
  appBarInherited?: string
  /** Inherits a valid custom appbar from another page  */
  appBarCustomInherited?: string
  /** Route of another page with a valid drawer to use. */
  drawerInherited?: string
  /** Route of another page with a valid content to use. */
  contentInherited?: string
  /** Route of another page with a valid background to use. */
  backgroundInherited?: string
  /** The page can retrieve or possibly store data in this field. */
  data?: any
  /** The page can retrieve or possibly save metadata in this field. */
  meta?: IGenericObject
  /** The page can retrieve or possibly save (Jsonapi) links in this field. */
  links?: any
}

/**
 * Type for the object which results from the parsing of `IStatePage.content`
 *
 * @see IStatePage
 */
export interface IStatePageContent {
  type: string
  name: string
  /** As of now, endpoint is for form contents.
   * It allows the usage of an automatic callback. */
  endpoint?: string
  args?: string
}
