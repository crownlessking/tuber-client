import { DEFAULT_BLANK_PAGE, DEFAULT_LANDING_PAGE } from '../constants';
import AbstractState from './AbstractState';
import IStateAllPages from '../interfaces/IStateAllPages';
import IStatePage from '../interfaces/IStatePage';
import State from './State';
import StateApp from './StateApp';
import StatePage from './StatePage';
import { no_path_vars, route_match_template } from '.';
import { log } from '../business.logic/logging';

export default class StateAllPages extends AbstractState {
  private _allPagesState: IStateAllPages;
  private _parentDef?: State;

  constructor(allPagesState: IStateAllPages, parent?: State) {
    super();
    this._allPagesState = allPagesState;
    this._parentDef = parent;
  }

  /** Get a copy of all pages json. */
  get state(): IStateAllPages { return this._allPagesState; }
  /** Chain-access root definition. */
  get parent(): State { return this._parentDef || new State(); }
  get props(): any { return this.die('Not implemented yet.', {}); }
  get theme(): any { return this.die('Not implemented yet.', {}); }

  /**
   * Get a page state.
   *
   * @param route the specified route
   * @returns the page state or null if not found
   */
  getPageState = (route: string): IStatePage | null => {
    if (no_path_vars(route)) {
      return this._allPagesState[route]
      || this._allPagesState[`/${route}`]
      || this._allPagesState[route.substring(1)];
    }

    // Handle routes with path variables

    let pageState: IStatePage | null = null;
    for (const template of Object.keys(this._allPagesState)) {
      if (route_match_template(template, route)) {
        pageState = this._allPagesState[template];
        break;
      }
    }
    return pageState;
  }

  /**
   * Get a page definition.
   *
   * @param route key of page. These can be valid URI parameters. Therefore,
   *             they should not be accessed using the (dot) `.` operator.
   */
  pageAt = (route: string): StatePage | null => {
    const pageState = this.getPageState(route);

    return pageState ? new StatePage(pageState, this) : null;
  };

  /**
   * Get a page definition
   *
   * @returns 
   */
  getPage = (app: StateApp): StatePage => {
    let pageState: IStatePage | null;
    if (app.route === '/') {
      pageState = this._allPagesState[app.homepage];
      if (pageState) {
        return new StatePage(pageState, this);
      }
    }
    const route = app.route;
    pageState = this.getPageState(route);
    if (pageState) {
      return new StatePage(pageState, this);
    }
    if (window.location.pathname.length > 1) {
      pageState = this.getPageState(window.location.pathname);
      if (pageState) {
        return new StatePage(pageState, this);
      }
    }
    // Oops! route is bad!
    if (route) {
      log(`'${route}' page not loaded. Fetching now..`);
      return new StatePage(this._allPagesState[DEFAULT_BLANK_PAGE], this);
    }
    if (app.homepage) {
      pageState = this.getPageState(app.homepage);
      if (pageState) {
        return new StatePage(pageState, this);
      }
    }
    return new StatePage(this._allPagesState[DEFAULT_LANDING_PAGE], this);
  };

  // set app(app: StateApp) { this.appDef = app }
} // END class AllPages -------------------------------------------------------
