
/** @see https://www.npmjs.com/package/jsonwebtoken */
export default interface IStateSession {
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
