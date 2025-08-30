import {
  APP_CONTENT_VIEW,
  DEFAULT_LANDING_PAGE_VIEW,
} from '../constants.client';
import { IStatePageContent } from '../interfaces/IStatePage';
import { ler } from '../business.logic/logging';
import { TObj } from 'src/common.types';

/**
 * Adds a new property and value to an object.
 *
 * @param data an object
 * @param prop new property name of object
 * @param val the value at that object property
 */
const create_writable_property = (data: unknown, prop: string, val: unknown): void => {
  Object.defineProperty(data, prop, {
    value: val,
    writable: true
  });
}

/**
 * Set a value within an object.
 *
 * @param obj arbitrary object
 * @param path dot-separated list of properties e.g. "pagination.users.limit"
 * @param val value to be assigned
 *
 * @todo NOT TESTED, please test
 */
export function set_val(obj: object, path: string, val: unknown): void {
  const propArray = path.split('.');
  let o = obj as TObj,
      candidate: unknown,
      j = 0;

  do {
    let prop = propArray[j];
    candidate = o[prop];

    // if this is the last property
    if (j >= (propArray.length - 1)) {
      create_writable_property(o, prop, val);
      return;

    // if the property does not exist but a value was provided
    } else if (!candidate) {
      create_writable_property(o, prop, {});
    }

    o = o[prop] as TObj;
    j++;
  } while (1);
}

/**
 * Parses the definition string found in `PageState.content` and
 * `StateDialogForm.content`.
 *
 * Format: "type : name : endpoint : args"
 *
 * **type**: Type of content found on the page.  
 * **name**: Identifier for a a specific content.  
 * **endpoint**: to which data may be sent or retrieve for the page.  
 * **args**: URL arguments when making server request using the enpoint.  
 *
 * @param content 
 * @returns `IStatePageContent` object.
 */
export function get_parsed_content(content?: unknown): IStatePageContent {
  if (typeof content !== 'string') {
    throw new Error('Content is not a string.');
  }
  const options = content.replace(/\s+/g, '').split(':');
  if (options.length <= 1) {
    ler('get_parsed_page_content: Invalid or missing `page` content definition');
    return {
      type: APP_CONTENT_VIEW,
      name: DEFAULT_LANDING_PAGE_VIEW
    };
  }
  const contentObj: IStatePageContent = {
    type: options[0],
    name: options[1]
  };
  if (options.length >= 3) {
    contentObj.endpoint = options[2];
  }
  if (options.length >= 4) {
    contentObj.args = options[3];
  }
  return contentObj;
}

/**
 * Delete path variables from the route.
 *
 * @param rawRoute
 * @param $var 
 * @returns new route without the path variables
 */
export function delete_path_vars(rawRoute: string, $var: string): string {
  const route = rawRoute.replace(/^\/|\/$/g, '');
  const pieces = route.split('/');
  const index = pieces.indexOf($var);
  if (index === -1) return route;
  return pieces.slice(0, index).join('/');
}

/**
 * Get base route and path variables values from route.  
 * @param template e.g. "/users/:id"
 * @param rawRoute e.g. "/users/1"
 * @returns Object with endpoint and path variables values.
 */
export function get_path_vars(
  template?: string,
  rawRoute?: string
): { baseRoute: string, params: string[], values: string[] } {
  if (!template || !rawRoute) {
    return { baseRoute: '',params: [], values: [] };
  }
  if (rawRoute === '/') {
    return { baseRoute: rawRoute, params: [], values: [] };
  }
  const values: string[] = [];
  const params: string[] = [];
  const route = rawRoute.replace(/^\/|\/$/g, '');
  const tpl = template.replace(/^\/|\/$/g, '');
  const tplPieces = tpl.split('/');
  const routePieces = route.split('/');
  let i = 0;
  for (const piece of tplPieces) {
    if (piece.startsWith(':')) {
      params.push(piece.replace(/^:/, ''));
      values.push(routePieces[i]);
    }
    i++;
  }
  return { baseRoute: routePieces[0], params, values };
}

/**
 * Check to see if the route matches the template route.
 * @param template e.g. "/users/:id" Key of the page state.
 * @param rawRoute e.g. "/users/1" Usually defined by link states.
 * @returns `true` if the route matches the template route.
 */
export function route_match_template(
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
 * Check to see if the route has path variables.
 * @param rawRoute
 * @returns `true` if the route has path variables.
 * @see no_path_vars
 */
export function has_path_vars(rawRoute: string): boolean {
  return rawRoute.replace(/^\/|\/$/g, '').split('/').length > 1;
}

/**
 * Check to see if the route has path variables.
 * @param rawRoute 
 * @returns `true` if the route has NO path variables.
 */
export function no_path_vars(rawRoute: string): boolean {
  return !has_path_vars(rawRoute);
}

/**
 * Determine if the route is a template route.
 *
 * A template route has path variable parameters. e.g. "/users/:id"
 *
 * @param possibleTemplate
 * @returns 
 */
export function is_template_route(possibleTemplate: string): boolean {
  return possibleTemplate.replace(/^\/|\/$/g, '').split('/').some(
    piece => piece.startsWith(':')
  );
}