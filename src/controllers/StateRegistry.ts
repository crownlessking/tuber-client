import { ler } from '../business.logic/logging';
import { remember_exception } from '../business.logic/errors';

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
      remember_exception(e);
      return defaultValue as T;
    }
  }
}