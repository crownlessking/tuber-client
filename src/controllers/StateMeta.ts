import AbstractState from './AbstractState';
import State from './State';
import Config from '../config';
import { TObj } from '../common.types';
import { error_id } from 'src/business.logic/errors';

export default class StateMeta extends AbstractState {

  constructor (private _metaState: TObj, private _parentDef?: State) {
    super();
  }

  get state(): TObj { return this._metaState; }
  get parent (): State {
    return this._parentDef ?? (this._parentDef = new State());
  }
  get props(): unknown { return this.die('Not implemented yet.', {}); }
  get theme(): unknown { return this.die('Not implemented yet.', {}); }

  /**
   * Get the metadata retrieved form the server.
   *
   * @param endpoint from which the metadata was retrieved.
   * @param key      of the exact metadata you want.
   */
  get = <T=unknown>(endpoint: string, key: string, $default: T): T => {
    try {
      const val = (this._metaState[endpoint] as TObj)?.[key];
      return val as T;
    } catch (e) {
      if (Config.DEBUG) {
        console.error(`Bad values passed to State.meta:
          either endpoint: '${endpoint}' or key: '${key}' or the data does not
          exist yet.`
        );
        console.error((e as Error).stack);
      }
      error_id(13).remember_error({
        code: 'MISSING_VALUE',
        title: `Bad values passed to State.meta:
          either endpoint: '${endpoint}' or key: '${key}' or the data does not
          exist yet.`,
        source: {
          parameter: `${endpoint}/${key}`
        },
        detail: (e as Error).stack
      }); // error 13
    }
    return $default;
  }
}
