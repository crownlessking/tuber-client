import AbstractState from './AbstractState';
import State from './State';
import { ler } from '../business.logic/logging';
import { tmpRemove } from 'src/slices/tmp.slice';
import { CSSProperties } from 'react';
import { is_record } from '../business.logic';

interface IConfiguration {
  dispatch?: Function;
}

function error_msg(msg: string) {
  ler(`StateTmp: ${msg}`);
}

export default class StateTmp extends AbstractState {
  private _dispatch?: Function;

  constructor(private _tmpState: Record<string, unknown>,
    private _parentDef?: State
  ) {
    super();
  }

  get state(): Record<string, unknown> { return this._tmpState; }
  get parent(): State {
    return this._parentDef ?? (this._parentDef = new State());
  }
  get props(): Record<string, unknown> { return this.die('Not implemented yet.', {}); }
  get theme(): CSSProperties { return this.die('Not implemented yet.', {}); }

  configure ({ dispatch }: IConfiguration): void {
    this._dispatch = dispatch;
  }

  private removeTemporaryValue(id: string): void {
    if (this._dispatch) {
      this._dispatch(tmpRemove(id));
      return;
    }
    error_msg('configure instance with dispatch.');
  }

  get = <T=unknown>(key: string, name: string, $default: T): T => {
    const obj = this._tmpState[key];
    if (is_record(obj)) {
      const val = obj[name] ?? $default;
      this.removeTemporaryValue(key);
      return val as T;
    }
    return $default;
  }

  set = <T=unknown>(id: string, name: string, value: T): void => {
    if (this._dispatch) {
      this._dispatch({
        type: 'tmp/tmpAdd',
        payload: { id, name, value }
      });
      return;
    }
    error_msg('configure instance with dispatch.');
  }

}
