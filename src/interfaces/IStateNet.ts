
export default interface IStateNet {
  /** Name of property or attribute where the token is stored. */
  csrfTokenName?: string;
  /**
   * Method used to store the CSRF token.
   *
   * List of methods:
   *
   * - **meta**  
   *    With the meta solution, the token will be stored as the value of the
   *    content attribute of a meta tag which will be identified by the value
   *    supplied in the csrf token name. e.g.
   *    ```html
   *    <meta name="csrf-token-name" content="token" />
   *    ```
   *
   * - **javascript**  
   *   With the javascript method, the token will be assumed to be saved as a
   *   global variable or at least nested within a global variable that is an
   *   object. If the latter is the case, you can supply a dot-separated list
   *   of properties as a string which is the exact location of the token.
   *   e.g.  
   *
   *   ```ts
   *   var globalVar = {
   *     property1: {
   *       token: '...'
   *     }
   *   };
   *   const csrfTokenName = 'globalVar.property1.token'
   *   ```
   *
   */
  csrfTokenMethod?: 'meta' | 'javascript';
  /**
   * CSRF Token.
   *
   * Contains the CSRF token once it is retrieved.
   */
  csrfToken?: string;
  /**
   * Any value inserted here is automatically included as a request headers.
   *
   * In addition, cone expressions are supported.
   */
  headers?: Record<string, string>;
  /** Username */
  name?: string;
  role?: string;
  /** 
   * User JWT token. It will be placed in the authorization header as the
   * "Bearer"
   */
  token?: string;
  jwt_version?: number;
  /** 
   * List of restrictions for the user. Each item in the list represents an
   * action that the user won't be able to perform.
   */
  restrictions?: string[];
}