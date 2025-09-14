// WARNING: Do not import anything here.
//          If you have to import, it doesn't belong here.

/**
 * Holds the last rendered content so that if a new one was not provided,
 * that one can be used.
 */
let currentContentJsx: JSX.Element | null;

let currentRefreshKey: number;

/** Get the last rendered content. */
export function get_last_content_jsx(): JSX.Element | null {
  return currentContentJsx;
}

/** Save the newly rendered content. */
export function save_content_jsx(content: JSX.Element | null): void {
  currentContentJsx = content;
}

export function clear_last_content_jsx(): void {
  currentContentJsx = null;
}

/**
 * Part of the force re-render mechanism. Record's a re-render attempt by
 * saving the refresh key.
 */
export function save_content_refresh_key(key = 0): void {
  currentRefreshKey = key;
}

/** 
 * Indicates whether a force re-render occurred by returning a number greater
 * than -1.
 */
export function get_content_refresh_key(): number {
  return currentRefreshKey ?? -1;
}

/** Checks the argument is an `object`. Returns `true` if it is. */
export const is_object = (obj: unknown): obj is object => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

/** Checks if the argument is an `object` with `string` indexes. Returns `true` if it is. */
export const is_record = <T>(obj: unknown): obj is Record<string, T> => {
  return obj !==null && typeof obj === 'object' && !Array.isArray(obj);
}

/** Checks if the argument is an `object` or an `array`. Returns `true` if it is. */
export const is_struct = <T=object>(obj: unknown): obj is T => {
  return obj !== null && typeof obj === 'object';
}

/** Checks if the argument is a `string`. Returns `true` if it is. */
export const is_string = (arg: unknown): arg is string => {
  return typeof arg === 'string';
}

/** Checks if the argument is a `string`. Returns `true` if it is. */
export const is_number = (arg: unknown): arg is number => {
  return typeof arg === 'number';
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
 * Get search query
 * @param queries state containing search queries
 * @param route current route or the key to the search query
 * @returns string
 * @deprecated
 */
export function get_appbar_input_val(
  queries: Record<string,{value?:string,mode?:'search'|'filter'}>,
  route: string
): {value?:string,mode?:'search'|'filter'}|null {
  const queryObj = queries[route] ?? queries[`/${route}`] ?? null;
  if (!queryObj) { return null; }
  return queryObj;
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
 * Get global variable value.
 *
 * Since there's a number of global variables that are defined by clients,
 * there's a strong chance that some or all of them may be undefined.
 * This function is a solution to that problem.
 *
 * @param varName string representation of in-code variable identifier.
 * @returns object or throws an exception
 * @throws an exception if the global variable name is invalid.
 * 
 * @deprecated Not in use!
 */
export function get_global_var<T=unknown>(varName: string): T {
  try {
    return window[varName] as T;
  } catch (e) {
    const message = `Global variable "${varName}" does not exist.`;
    console.error(message);
  }
  return { } as T;
}

/** @deprecated */
export function get_val_old<T=unknown>(obj: unknown, path: string): T|null {
  if (!is_record(obj)) {
    return null;
  }
  const paths = path.trim().split('.');
  let i = 0, o = obj;

  do {
    let key = paths[i].trim();
    let candidate = o[key];
    if (candidate === undefined || candidate === null) {
      break;
    } else if (!is_record(candidate)) {
      return candidate as T;
    }
    o = candidate;
    i++;
  } while (i < paths.length);

  return null;
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
 * @param path dot-separated path of object properties.
 */
export function get_val_old2<T=unknown>(obj: unknown, path: string): T|undefined {
  if (!is_struct(obj)) {
    return undefined;
  }
  const paths = path.trim().split('.');
  let i = 0, o: unknown = obj;

  do {
    let key = paths[i].trim();
    let candidate: unknown;

    // Handle arrays with numeric indices
    if (Array.isArray(o) && !isNaN(Number(key))) {
      candidate = o[Number(key)];
    } else if (is_record(o)) {
      candidate = o[key];
    } else {
      break; // Can't traverse further
    }

    if (candidate === undefined || candidate === null) {
      break;
    } else if (!is_struct(candidate)) {
      return candidate as T;
    }
    o = candidate;
    i++;
  } while (i < paths.length);

  return undefined;
}

/**
 * Safely get a value from an object by dot-notation path
 * @param obj - The object to retrieve a value from
 * @param path - Dot notation path to the property (e.g., 'user.address.street')
 * @returns The value at the specified path or undefined if not found
 */
export function get_val<T = unknown>(obj: unknown, path: string): T | undefined {
  // Handle invalid inputs
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return undefined;
  }

  // Handle empty or whitespace-only path
  const trimmedPath = path.trim();
  if (!trimmedPath) {
    return undefined;
  }

  // Split the path by dots and trim whitespace
  const parts = trimmedPath.split('.');
  
  // Handle consecutive dots
  if (parts.some(part => part === '')) {
    return undefined;
  }
  
  let current: unknown = obj;
  
  // Traverse the object according to the path
  for (let i = 0; i < parts.length; i++) {
    const key = parts[i].trim();
    
    // If current is null or undefined, we can't go further
    if (current === null || current === undefined) {
      return undefined;
    }
    
    // If current is not an object/array, we can't traverse further
    if (typeof current !== 'object') {
      return undefined;
    }
    
    // For arrays, validate the index
    if (Array.isArray(current)) {
      // Ensure key is a valid array index (non-negative integer)
      const index = Number(key);
      if (isNaN(index) || index < 0 || !Number.isInteger(index)) {
        return undefined;
      }
      
      current = current[index];
    } else {
      // For objects, access the property using index notation
      // This avoids TypeScript errors about dynamic property access
      current = (current as Record<string, unknown>)[key];
    }
  }
  
  // Return the final value (it can be any type, including falsy values)
  return current as T;
} // END - get_val

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
 * Ensures that the endpoint has an ending forward slash.
 *
 * @returns string
 * @returns fixed endpoint
 * 
 * @deprecated Not in use.
 */
export function get_endpoint_ending_fixed(endpoint?: string): string {
  if (endpoint) {
    return endpoint.slice(-1) === '/' ? endpoint : endpoint + '/';
  }
  return '';
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
 * Get a value from an object as the same type as the default value without
 * causing an exception.
 * @param obj arbitrary object
 * @param path dot-separated object (nested) keys
 * @param _default default value
 * @returns value or default value
 */
export function safely_get_as<T=unknown>(
  obj: unknown,
  path = '',
  _default: T
): T {
  const value = get_val<T>(obj, path);

  return value ? value : _default;
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
 * Generates a mongodb ObjectId.
 *
 * @see https://gist.github.com/solenoid/1372386
 */
export function mongo_object_id(): string {
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
      return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
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
 * Given a URL, it will return the content as a string.
 *
 * Note: This function is NOT used anywhere. Most likely, it is safe to remove.
 *
 * @param theUrl 
 *
 * @see https://stackoverflow.com/questions/10642289/return-html-content-as-a-string-given-url-javascript-function
 * @deprecated Not in use
 */
export function http_get(theUrl: string): void
{
  // code for IE7+, Firefox, Chrome, Opera, Safari
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      return xmlhttp.responseText;
    }
  }
  xmlhttp.open("GET", theUrl, false);
  xmlhttp.send();    
}

/**
 * Get the right theme state.
 * @param mode light or dark
 * @param main the main state
 * @param light the light state
 * @param dark the dark state
 * @returns the right state
 */
export function get_themed_state<T=unknown>(
  mode: 'dark'|'light',
  main: unknown,
  light: unknown,
  dark: unknown
): T {
  if (light && dark) {
    return mode === 'dark' ? dark as T : light as T;
  }
  return main as T;
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
 * TODO Implement this function.
 * This function is for handling unexpected nesting.
 * It's a common problem when the server returns a response that is
 * not in the expected format.  
 * For example, the server returns a response like this:  
 * ```json
 * {
 *   "data": {
 *     "id": "123",
 *     "type": "users",
 *     "attributes": {
 *       "name": "John Doe"
 *     }
 *   }
 * }
 * ```
 * But the client expects a response like this:
 * ```json
 * {
 *   "id": "123",
 *   "type": "users",
 *   "attributes": {
 *     "name": "John Doe"
 *   }
 * }
 * ```
 * This function should be able to handle this problem.
 * It should be able to detect the unexpected nesting and fix it.
 * It should also be able to detect the expected nesting and leave it
 * alone.
 * This function should be able to handle the following cases:
 * 1. The server returns a response with the expected nesting.  
 * 2. The server returns a response with the unexpected nesting.  
 * 3. The server returns a response with the expected nesting and
 *   unexpected nesting.
 *
 * As more cases are discovered, they should be added to this list.
 * 
 * @deprecated Not in use
 */
export function resolve_unexpected_nesting (response: unknown) {
  if (typeof response === 'object'
    && response !== null
    && !Array.isArray(response)
    && 'response' in response
  ) {// Case of nested response
    return response.response;
  }

  // ... other cases

  return response;
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

/** @deprecated */
interface IViewportSize {
  width: number;
  height: number;
}

/**
 * Get browser tab viewport size.
 *
 * @deprecated
 * Credit:
 * @see https://stackoverflow.com/questions/1377782/javascript-how-to-determine-the-screen-height-visible-i-e-removing-the-space
 */
export function get_viewport_size(): IViewportSize {
  let e: unknown = window, a = 'inner';
  if ( !( 'innerWidth' in window ) ) {
    a = 'client';
    e = document.documentElement || document.body;
  }
  return {
    width : (e as Record<string, unknown>)[ a+'Width' ] as number,
    height : (e as Record<string, unknown>)[ a+'Height' ] as number
  };
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