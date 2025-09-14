import { ler } from '../business.logic/logging';
import { error_id } from '../business.logic/errors';

export class StateRegistry {
  
  constructor(private _registryState: Record<string, unknown>) {}

  get<T=unknown>(key: string, defaultValue?: T): T {
    try {
      const val = this._registryState[key];
      if (typeof val !== 'undefined') {
        return val as T;
      }
      return defaultValue as T;
    } catch (e) {
      ler(`StateRegistry.get(): error for key "${key}"`);
      error_id(15).remember_exception(e); // error 15
      return defaultValue as T;
    }
  }
}