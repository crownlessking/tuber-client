import {
  APP_CONTENT_VIEW,
  DEFAULT_LANDING_PAGE_VIEW,
} from '../constants.client';
import { IStatePageContent } from '../interfaces/IStatePage';
import { ler } from './logging';

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
 * Parse cookie string into an object.
 * @param cookieString Cookie string
 * @returns object
 */
export function parse_cookies() {
  const cookies = {} as Record<string, string>;
  const pairs = document.cookie.split(';');

  pairs.forEach(pair => {
    const [key, value] = pair.split('=').map(s => s.trim());
    cookies[key] = value;
  })

  return cookies;
}

/**
 * Get the cookie value by name.
 * @param name Cookie name
 * @returns T
 */
export function get_cookie<T=string>(name: string): T {
  const cookies = parse_cookies();
  const cookie = cookies[name] ?? '';
  return cookie as unknown as T;
}

/**
 * Get the search query from the URL.
 *
 * @param url 
 * @returns string
 * 
 * @deprecated Not in use
 */
export function set_url_query_val(url: string, param: string, val?: string) {
  const urlObj = new URL(url);
  const query = new URLSearchParams(urlObj.searchParams);
  const { origin, pathname } = urlObj;
  if (typeof val === 'undefined') {
    query.delete(param);
    const newUrl = `${origin}${pathname}?${query.toString()}`;
    return newUrl;
  }
  query.set(param, val.toString())
  const newUrl = `${origin}${pathname}?${query.toString()}`;
  return newUrl;
}

/**
 * Set a value within an object.
 *
 * @param obj arbitrary object
 * @param path dot-separated list of properties e.g. "pagination.users.limit"
 * @param val value to be assigned
 */
export function set_val(obj: object, path: string, val: unknown): void {
  if (!obj || typeof obj !== 'object') {
    throw new Error('set_val: obj must be an object');
  }
  if (!path || typeof path !== 'string') {
    throw new Error('set_val: path must be a non-empty string');
  }

  const propArray = path.split('.');
  let current = obj as Record<string, unknown>;

  // Navigate to the parent of the target property
  for (let i = 0; i < propArray.length - 1; i++) {
    const prop = propArray[i];
    
    // If property doesn't exist or isn't an object, create it
    if (!current[prop] || typeof current[prop] !== 'object' || Array.isArray(current[prop])) {
      current[prop] = {};
    }
    
    current = current[prop] as Record<string, unknown>;
  }

  // Set the final property
  const finalProp = propArray[propArray.length - 1];
  current[finalProp] = val;
}

/**
 * Get HTML head meta data.
 *
 * @param name 
 * @returns string
 */
export function get_head_meta_content(name: string, $default = 'app'): string {
  const element = document.querySelector(`meta[name="${name}"]`);
  const meta = element as HTMLMetaElement | null;
  return meta && meta.content ? meta.content : $default;
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
 * Ensures the origin is a valid URL has an ending forward slash.
 *
 * @returns string
 */
export function get_origin_ending_fixed(origin?: string): string {
  if (origin) {
    return origin.slice(-1) === '/' ? origin : origin + '/';
  }
  return window.location.origin + '/';
}

/**
 * Removes ending forward slash from the endpoint if there is one.
 *
 * @param endpoint
 * @returns string
 */
export function clean_endpoint_ending(endpoint?: string): string {
  if (endpoint) {
    return endpoint.slice(-1) === '/' ? endpoint.slice(0, -1) : endpoint;
  }
  return '';
}

/** Ensures that question mark symbol is included query string. */
export function get_query_starting_fixed(query?: string): string {
  if (query) {
    return query.charAt(0) === '?' ? query : '?' + query;
  }
  return '';
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
 * Ensures that the form name ends with the suffix 'Form'.
 *
 * @param name
 * @returns string
 */
export function get_state_form_name(name: string): string {
  return name.slice(-4) === 'Form' ? name : name + 'Form';
}

/**
 * Ensures that the dialog name ends with 'Dialog'.
 *
 * @param {string} name 
 * @returns {string}
 * 
 * @deprecated Not in use
 */
export function get_state_dialog_name(name: string): string {
  return name.slice(-6) === 'Dialog' ? name : name + 'Dialog';
}

/**
 * Removes leading and ending forward and back slashes.
 *
 * @param str 
 */
export function trim_slashes(str: string): string {
  let s = str;
  while(s.charAt(0) === '/' || s.charAt(0) === '\\')
  {
    s = s.substring(1);
  }
  while (s.charAt(s.length - 1) === '/' || s.charAt(s.length - 1) === '\\')
  {
    s = s.substring(0, s.length - 1);
  }
  return s;
}

/**
 * Extracts the endpoint from the pathname.
 *
 * The pathname can include a query string e.g. `name1/name2?q=123`
 *
 * This function will not work with whole URL that includes the domain name
 * and/or the protocol.
 *
 * @param pathname 
 */
export function get_endpoint(pathname: string): string {
  let pname = trim_slashes(pathname);
  const argsIndex = pathname.indexOf('?');
  if (argsIndex >= 0) {
    pname = pathname.substring(0, argsIndex);
  }
  const params = pname.split(/\/|\\/);

  return params[params.length - 1];
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
