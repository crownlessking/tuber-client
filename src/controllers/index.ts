import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  APP_CONTENT_VIEW,
  DEFAULT_LANDING_PAGE_VIEW,
} from '../constants';
import { IJsonapiResourceAbstract } from '../interfaces/IJsonapi';
import { IStatePageContent } from '../interfaces/IStatePage';
import { err, ler } from '../business.logic/logging';

/**
 * Converts an icon definition to a valid argument for the `FontAwesomeIcon`
 * element.
 *
 * e.g.
 * 
 * ```tsx
 * const iconDefinition = '<icon_type>, <icon_name>'
 * const validIconArgument = getFontAwesomeIconProp(iconDefinition)
 *
 * <FontAwesomeIcon icon={validIconArgument} />
 * ```
 *
 * Icon types are, "fas, far, fab"
 *
 * @param iconStr 
 * @deprecated
 */
export function get_font_awesome_icon_prop(iconStr: string): IconProp {
  const pieces = iconStr.replace(/\s+/,'').split(',');

  if (pieces.length === 2) {
    return pieces as IconProp;
  } else if (pieces.length === 1) {
    return ['fas', iconStr] as IconProp;
  }

  err('bad icon definition. Check your JSON.');

  return '' as IconProp;
}

/**
 * Get browser tab viewport size.
 *
 * @deprecated
 * Credit:
 * @see https://stackoverflow.com/questions/1377782/javascript-how-to-determine-the-screen-height-visible-i-e-removing-the-space
 */
export function get_viewport_size(): { width: number; height: number }
{
  let e: any = window, a = 'inner';
  if ( !( 'innerWidth' in window ) ) {
    a = 'client';
    e = document.documentElement || document.body;
  }
  return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}

/**
 * Get a height in pixels that can help you strech an HTML element vertically
 * to fit the remaining screen space.
 *
 * @param bottom margin between the bottom of the viewport and the streched
 *               element.
 *               e.g. How much space do you want between the bottom of the
 *                    viewport and your element
 * @returns height in pixels
 * @deprecated
 */
export function stretch_to_bottom(bottom: number): number {
  const height = get_viewport_size().height;

  return height - bottom;
}

/**
 * Find nested values in object using a string of dot-separated object keys.
 *
 * e.i.
 * ```ts
 * const obj = {
 *    account: {
 *      user: {
 *        lastname: 'Foo'
 *      }
 *    }
 * };
 * const lastname = getVal(obj, 'account.user.lastname')
 * ```
 *
 * @param obj 
 * @param path dot-separated object (nested) keys
 * @returns the value of the object property or `null` if the property does not
 *          exist.
 */
export function get_val<T=any>(obj: any, path: string): T|null {
  if (typeof obj === 'undefined' || Array.isArray(obj) || typeof obj !== 'object') {
    return null;
  }
  const paths = path.split('.');
  let i = 0,
    key = paths[i],
    candidate = obj[key];

  while (i < paths.length) {
    if (!candidate) {
      break;
    } else if (i >= paths.length - 1) {
      return candidate as T ?? null;
    }
    i++;
    key = paths[i];
    candidate = candidate[key];
  }

  return null;
}

/**
 * Adds a new property and value to an object.
 *
 * @param data an object
 * @param prop new property name of object
 * @param val the value at that object property
 */
const create_writable_property = (data: any, prop: string, val: any): void => {
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
export function set_val(obj: any, path: string, val: any): void {
  const propArray = path.split('.');
  let o = obj,
      candidate: any,
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

    o = o[prop];
    j++;
  } while (1);
}

/**
 * Get the query string value by key.
 * @param url
 * @param key
 * @returns value of the query string key
 */
export function get_query_val(url: string, key: string): string {
  const query = url.split('?')[1];
  if (!query) return '';
  const pairs = query.split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const [k, v] = pair.split('=');
    if (k === key) return v;
  }
  return '';
}

/**
 * Get all query string keys as an array
 * @param url
 * @returns array of query string keys
 */
export function get_query_keys(url: string): string[] {
  const query = url.split('?')[1];
  if (!query) return [];
  return query.split('&').map((pair) => pair.split('=')[0]);
}

/**
 * Get all query string values as an object
 * @param url
 * @returns object of query string keys and values
 */
export function get_query_values(url: string): { [key: string]: string } {
  const query = url.split('?')[1];
  if (!query) return {};
  const values: { [key: string]: string } = {};
  const pairs = query.split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const [k, v] = pair.split('=');
    values[k] = v;
  }
  return values;
}

/**
 * Set the query string value by key.
 * @param url
 * @param key
 * @param val
 * @returns new url with the query string key and value
 */
export function set_url_query_val(url: string, key: string, val?: string) {
  const urlObj = new URL(url);
  const query = new URLSearchParams(urlObj.searchParams);
  const { origin, pathname } = urlObj;
  if (typeof val === 'undefined') {
    query.delete(key);
    const newUrl = `${origin}${pathname}?${query.toString()}`;
    return newUrl;
  }
  query.set(key, val.toString());
  const newUrl = `${origin}${pathname}?${query.toString()}`;
  return newUrl;
}

/**
 * Delete array elements by index range.
 * @param arr
 * @param start
 * @param end
 * @returns new array with elements removed
 */
export function delete_range<T>(arr: T[], start: number, end: number): T[] {
  return arr.slice(0, start).concat(arr.slice(end + 1));
}

/**
 * Get HTML head meta data.
 *
 * @param name 
 * @returns content of the meta tag
 */
export function get_head_meta_content(name: string): string {
  const meta = document.querySelector(`meta[name="${name}"]`);

  if (meta) {
    return (meta as HTMLMetaElement).content;
  }

  // err(`Meta with '${name}' name does not exist.`)

  return '';
}

/**
 * Converts an endpoint which contains hyphens to a camel case
 * version.
 *
 * @param endpoint
 * @returns camel case version of the endpoint
 */
export function camelize(endpoint: string): string {
  return endpoint.replace(/-([a-zA-Z])/g, g => g[1].toUpperCase());
}

/**
 * Safely get a value from the given object.
 *
 * This function will prevent exceptions or catch them so they can be store and
 * viewed later without crashing the app.
 *
 * @param obj 
 * @param path     an existing property of `obj` or a dot-separated list of
 *                 properties.
 * @param _default value to return if `obj[path]` is undefined
 * @returns value of `obj[path]` or `_default` if `obj[path]` is undefined
 * @deprecated
 */
export function safely_get(obj: any, path = '', _default?: any): any {
  const value = get_val(obj, path);

  if (value !== null) {
    return value;
  }

  // force function to return undefined
  if (_default === 'undefined') {
    return undefined;
  }

  if (_default === undefined) {
  
    // If a path was not provided, we can safely assume that the object is being
    // tested for a valid value
    if (!path) return {};
  
    return null;
  }

  return _default;
}

/**
 * Get a value from an object as the same type as the default value without
 * causing an exception.
 * @param obj arbitrary object
 * @param path dot-separated list of properties
 * @param _default default value
 * @returns value of `obj[path]` or `_default` if `obj[path]` is undefined
 */
export function safely_get_as<T=any>(obj: any, path = '', _default: T): T {
  const value = get_val<T>(obj, path);

  return value !== null ? value : _default;
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
export function get_parsed_page_content(str?: string): IStatePageContent {
  const content = str ?? '';
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

/** Type for event's callback defined with a string. */
export type THandleEvent = 'onclick' | 'onchange' | 'onkeydown' | 'onblur';

/**
 * Save array index into the array element.
 * 
 * **Purpose:** Useful for array of object where an element needs to be modify
 * and retrieve in the index directly from the element to be modify avoid
 * having to iterate through the array find it.
 *
 * **Be careful:** Object to be indexed must extends the `IFeetlyIndexed`
 * interface.
 * @param a
 * @see IFeetlyIndexed
 * @see jsonapi_fleetly_index
 * @deprecated
 */
export function jsonapi_fleetly_index(a: IJsonapiResourceAbstract[]): void {
  if (a.length <= 0
    || (a.length > 0 && typeof a[0] !== 'object' && !Array.isArray(a[0]))
  ) {
    return;
  }
  a.map((e, i) => e._index = i);
}

/**
 * Get the real route from the template route by ignoring the path variables.
 * @param templateRoute
 * @param templateRoute 
 */
export function get_base_route(templateRoute?: string): string {
  if (!templateRoute) return '';
  return templateRoute.replace(/^\/|\/$/g, '').split('/')[0];
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