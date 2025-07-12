// WARNING: Do not import anything here.

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

/** Returns `true` if the argument is an object. */
export const is_object = (obj: any) => {
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    return true;
  }
  return false;
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
export function get_global_var(varName: string): any {
  try {
    return window[varName];
  } catch (e: any) {
    const message = `Global variable "${varName}" does not exist.`;
    console.error(message);
  }
  return { }
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
      return candidate;
    }
    i++;
    key = paths[i];
    candidate = candidate[key];
  }

  return null;
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
 * Get a value from an object as the same type as the default value without
 * causing an exception.
 * @param obj arbitrary object
 * @param path dot-separated object (nested) keys
 * @param _default default value
 * @returns value or default value
 * @deprecated
 */
export function safely_get_as<T=any>(
  obj: any,
  path = '',
  _default: T
): T {
  const value = get_val<T>(obj, path);

  return value !== null ? value : _default;
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
export function get_themed_state<T=any>(
  mode: 'dark'|'light',
  main: any,
  light: any,
  dark: any
): T {
  if (light && dark) {
    return mode === 'dark' ? dark : light;
  }
  return main;
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
export function resolve_unexpected_nesting (response: any) {
  if (response.response) {// Case of nested response
    return response.response;
  }

  // ... other cases

  return response;
}