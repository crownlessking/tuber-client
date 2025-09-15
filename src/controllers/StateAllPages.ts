import { DEFAULT_BLANK_PAGE, DEFAULT_LANDING_PAGE } from '../constants.client';
import AbstractState from './AbstractState';
import IStateAllPages from '../interfaces/IStateAllPages';
import IStatePage from '../interfaces/IStatePage';
import State from './State';
import type StateApp from './StateApp';
import StatePage from './StatePage';
import { log } from '../business.logic/logging';

export default class StateAllPages extends AbstractState {

  constructor(private _allPagesState: IStateAllPages,
    private _parentDef?: State
  ) {
    super();
  }

  /** Get a copy of all pages json. */
  get state(): IStateAllPages { return this._allPagesState; }
  /** Chain-access root definition. */
  get parent(): State {
    return this._parentDef ?? (this._parentDef = new State());
  }
  get props(): unknown { return this.die('Not implemented yet.', {}); }
  get theme(): unknown { return this.die('Not implemented yet.', {}); }

  /** Check to see if the route has path variables. */
  private _has_path_vars(rawRoute: string): boolean {
    return rawRoute.replace(/^\/|\/$/g, '').split('/').length > 1;
  }

  /** Check to see if the route has path variables. */
  private _no_path_vars(rawRoute: string): boolean {
    return !this._has_path_vars(rawRoute);
  }

  /**
   * Check to see if the route matches the template route.
   * @param template e.g. "/users/:id" Key of the page state.
   * @param rawRoute e.g. "/users/1" Usually defined by link states.
   * @returns `true` if the route matches the template route.
   */
  private _route_match_template(
    template: string,
    rawRoute: string
  ): boolean {
    if (rawRoute === '/') {
      return template === rawRoute;
    }
    const routePaths = rawRoute.replace(/^\/|\/$/g, '').split('/');
    const templatePaths = template.replace(/^\/|\/$/g, '').split('/');
    if (routePaths[0] === templatePaths[0]
      && routePaths.length === templatePaths.length
    ) {
      return true;
    }
    return false;
  }

  /**
   * Get a page state.
   *
   * @param route the specified route
   * @returns the page state or null if not found
   */
  getPageState = (route: string): IStatePage | null => {
    if (this._no_path_vars(route)) {
      return this._allPagesState[route]
      || this._allPagesState[`/${route}`]
      || this._allPagesState[route.substring(1)];
    }

    // Handle routes with path variables

    let pageState: IStatePage | null = null;
    for (const template of Object.keys(this._allPagesState)) {
      if (this._route_match_template(template, route)) {
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
