import { mongo_object_id } from '.'
import { IGenericObject } from 'src/interfaces/IState'
import IStateAppBarQueries from 'src/interfaces/IStateAppBarQueries'
import C from '../config'
import { IJsonapiError } from '../interfaces/IJsonapi'

let tmpErrorsList: IJsonapiError[]

/**
 * A simple shortcut for triggering exceptions and preventing unecessarily
 * inflated code blocks.
 */
function _err(message: string): void {
  if (C.DEBUG) {
    throw new Error (message)
  }
}

function _ler(...args: any): void {
  if (C.DEBUG) {
    console.error(...args)
  }
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
 */
export function get_global_var(varName: string): any {
  try {
    return window[varName]
  } catch (e: any) {
    const message = `Global variable "${varName}" does not exist.`
    _err(message)
    remember_exception(e, message)
  }
  return { }
}

/** Get search query */
export function get_search_query(
  queries: IStateAppBarQueries,
  route: string
): string {
  try {
    return queries[route] || ''
  } catch (e: any) {
    const message = `Search query for route '${route}' does not exist.`
    _ler(message)
    remember_exception(e, message)
  }
  return ''
}

/**
 * Set the error code in a Jsonapi error object.
 *
 * This function is provided just in case the error code is missing but needs
 * to be set.
 *
 * @param error 
 */
export function get_error_code(error?: IJsonapiError): string {
  return (error && error.code) ? error.code : Date.now().toString()
}

/**
 * Use to set an error object code (`error.code`) if it is NOT set.
 *
 * It will be given a timestamp as code. Guaranteed to be unique.
 *
 * __Note__: This function was create out of a serious consideration to make
 * the redux `state.error` object an array. This function is meant to assist
 * in doing that by giving a code to error object who do not have one.
 */
export function set_date_error_code(error: IJsonapiError): void {
  error.code = error.code || Date.now().toString()
}

export function set_status_error_code(error: IJsonapiError): void {
  error.code = error.code || error.status || Date.now().toString()
}

/** Format JSON */
export function format_json_code(state: IGenericObject | string): string {
  const jsonStr = typeof state === 'string' ? state : JSON.stringify(state, null, 4)
  return jsonStr
    .replace(/\n/g, '<br>')
    .replace(/\\n/g, '<br>&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/\s/g, '&nbsp;')
}

/** Hightlights JSON */
function _color_json_code_regex_highlight(jsonStr: string): string {
  return jsonStr
    .replace(/\n/g, '<br>')
    .replace(/\\n/g, '<br>&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/\s/g, '&nbsp;')
    .replace(/:("[^"]*")/g, (_, m) => `:${m.replace(/,/g, '⁏')}`)
    .replace(/("[^"]*")(\s*:\s*)/g, (_, m1, m2) => `${m1.replace(/⁏/g, ',')}${m2}`)
    .replace(/("[^"]*")/g, (_, m) => `<span class="json-string">${m}</span>`)
    .replace(/(:\s*)(\d+)/g, (_, m1, m2) => `${m1}<span class="json-number">${m2}</span>`)
    .replace(/(:\s*)(true|false)/g, (_, m1, m2) => `${m1}<span class="json-boolean">${m2}</span>`)
    .replace(/(:\s*)(null)/g, (_, m1, m2) => `${m1}<span class="json-null">${m2}</span>`)
    //.replace(/(:\s*)(\{|\[)/g, (_, m1, m2) => `${m1}<span class="json-brace">${m2}</span>`)
    //.replace(/(\}|\])(,?)/g, (_, m1, m2) => `<span class="json-brace">${m1}</span>${m2}`)
    .replace(/(,)/g, '<span class="json-comma">,</span>')
}

/**
 * Takes json as an object and apply color-coded highlighting to make it more
 * readable after converting it to a string using `JSON.stringify`.
 */
export function color_json_code(obj: IGenericObject | string): string {
  if (typeof obj === 'object' && obj !== null && !(obj instanceof Array)) {
    const jsonStr = JSON.stringify(obj, null, 4)
    const jsonStrHighlighted = _color_json_code_regex_highlight(jsonStr)
    return jsonStrHighlighted
  } else if (typeof obj === 'string') {
    const jsonStrHighlighted = _color_json_code_regex_highlight(obj)
    return jsonStrHighlighted
  }
  C.ler(`color_json_code: obj is not an object or string. obj: ${obj}`)
  return ''
}

/**
 * Converts an error object to a Jsonapi error object.
 *
 * __Dev note__: For compatibility, simply insert the error object key that
 * most closely match the jsonapi error object key in value or purpose.
 *
 * @param error 
 */
export function to_jsonapi_error(error: any, title?: string, meta?: any): IJsonapiError {
  return {
    code: mongo_object_id(),
    title: title ?? error.message,
    detail: error.stack,
    meta
  }
}

/** 
 * Temporarily saves error. Use when an exception was caught in a try-catch
 * statement.
 */
export function remember_exception(e: unknown, title?: string) {
  if (C.DEBUG) {
    tmpErrorsList = tmpErrorsList || []
    tmpErrorsList.push(to_jsonapi_error(e, title))
  }
}

/** Temporarily saves a manually defined error. */
export function remember_error(error: IJsonapiError) {
  if (C.DEBUG) {
    tmpErrorsList = tmpErrorsList || []
    tmpErrorsList.push(error)
  }
}

/** 
 * Temporarily saves error. Use when an error response is received from the
 * server.
 */
export function remember_jsonapi_errors(errors: IJsonapiError[]) {
  if (C.DEBUG) {
    errors.forEach(set_status_error_code)
    tmpErrorsList = tmpErrorsList || []
    tmpErrorsList.push(...errors)
  }
}

/**
 * Temporarily saves error. Use when there is a possibility for invalid values
 * but no exception will be thrown.
 */
export function remember_possible_error(title: string, data?: any) {
  if (C.DEBUG) {
    tmpErrorsList = tmpErrorsList || []
    const detail = data
      ? JSON.stringify(data, null, 4)
      : 'No data. It is either undefined or null.'
    tmpErrorsList.push({ code: mongo_object_id(), title, detail })
  }
}

/** Get list of error */
export function get_errors_list(): IJsonapiError[] {
  return tmpErrorsList || []
}