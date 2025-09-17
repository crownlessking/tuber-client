import { is_record } from './utility';

// Interface for the old IConfiguration usage
export interface IConfiguration {
  /**
   * Initialize the configuration object with values.
   * @param data arbitrary object containing key-value pairs.
   * @returns void
   */
  init(data?: unknown): void;
  /**
   * Save an immutable value.
   *
   * __WARNING__: This value is immutable.
   * @param path period-seperated list of properties
   * @param val value to be saved.
   * @returns void
   */
  set(path: string, val: unknown): void;
  /**
   * Read a value.
   *
   * @param path period-seperated list of properties
   * @param $default default value to return if the value at the specified path
   *                 is undefined.
   * @returns the value at the specified path or the default value.
   */
  read<T=unknown>(path: string, $default?: T): T;
  /**
   * Save a mutable value.
   *
   * @param path period-seperated list of properties
   * @param val value to be saved.
   * @returns void
   */
  write<T=unknown>(path: string, val: T): void;
  /**
   * Delete a property.
   *
   * @param path period-seperated list of nested properties
   * @returns void
   */
  delete(path: string): void;
  /**
   * Use this method if you want to remove all values from the config object.
   */
  clear(): void;
  [key: string]: unknown;
}

/**
 * Configuration object.  
 * It is use to save global values that can be accessed anywhere in the app.
 * Values can be immutable or mutable. Use set() to save immutable values and
 * write() to save mutable values.
 */
export class Configuration implements IConfiguration {
  [key: string]: unknown;

  // TODO: Fix race condition - these global variables can cause issues in concurrent scenarios
  private _isWritable = false;
  private _shouldDelete = false;

  private _config: Record<string, unknown> ;

  constructor(init: unknown) {
    this._config = is_record(init) ? init : {};
    
    // Create a proxy to make config properties accessible directly on the instance
    return new Proxy(this, {
      get(target, prop: string | symbol) {
        if (typeof prop === 'string' && prop in target._config) {
          return target._config[prop];
        }
        return (target as any)[prop];
      },
      set(target, prop: string | symbol, value) {
        if (typeof prop === 'string' && !(prop.startsWith('_') || ['set', 'read', 'write', 'delete', 'clear'].includes(prop))) {
          target._config[prop] = value;
          return true;
        }
        (target as any)[prop] = value;
        return true;
      },
      has(target, prop: string | symbol) {
        if (typeof prop === 'string' && prop in target._config) {
          return true;
        }
        return prop in target;
      },
      ownKeys(target) {
        return [...Object.getOwnPropertyNames(target), ...Object.keys(target._config)];
      },
      getOwnPropertyDescriptor(target, prop: string | symbol) {
        if (typeof prop === 'string' && prop in target._config) {
          return {
            enumerable: true,
            configurable: true,
            value: target._config[prop]
          };
        }
        return Object.getOwnPropertyDescriptor(target, prop);
      }
    });
  }

  init(data?: unknown): void {
    if (is_record(data)) {
      // Clear existing config
      this._config = {};
      // Add new values
      for (const key in data) {
        this._config[key] = data[key];
      }
    }
  }

  /**
   * Resolves an object value from a period-separated list of object properties.
   *
   * This is a new implementation of `resolve()` that does not use a for-loop.
   *
   * TODO finish implementing this function
   *
   * @param obj  arbitrary object.
   * @param path a string containing the dot-separated path of object properties,
   *             e.g., "pagination.users.limit"
   * @param val value to set (optional)
   * @param writable whether properties should be writable
   * @param shouldDelete whether to delete the property
   */
  private _resolve<T=unknown>(path: string, val?: unknown): T | undefined {

    const propArray = path.split('.');
    let o = this._config; // Use _config since Proxy handles access

    for (let i = 0; i < propArray.length; i++) {
      const prop = propArray[i];

      // If last property in path
      if (i === propArray.length - 1) {
        if (val !== undefined) {
          if (this._isWritable) {
            // For writable properties, use regular assignment
            o[prop] = val;
          } else {
            // For non-writable properties, use defineProperty
            Object.defineProperty(o, prop, {
              value: val,
              writable: false,
              enumerable: true,
              configurable: true
            });
          }
          return val as T;
        } else if (this._shouldDelete) {
          delete o[prop];
          return undefined;
        }
        return o[prop] as T;
      }

      // If property does not exist, create it if setting a value
      if (!(prop in o) || o[prop] === undefined) {
        if (val !== undefined) {
          o[prop] = {};
        } else {
          return undefined;
        }
      }

      // Move deeper
      if (is_record(o[prop])) {
        o = o[prop];
      } else {
        return undefined;
      }
    }
    return undefined;
  };

  set(path: string, val: unknown): void {
    this._isWritable = false;
    this._resolve(path, val);
  }

  read<T=undefined>(path: string, $default?: T): T {
    const result = this._resolve(path);
    return (result ?? $default) as T;
  }

  write<T=unknown>(path: string, val: T): void {
    // Handle overwriting immutable properties by deleting first
    const propArray = path.split('.');
    if (propArray.length === 1 && propArray[0] in this._config) {
      delete this._config[propArray[0]];
    }
    this._isWritable = true;
    this._resolve(path, val);
    this._isWritable = false;
  }

  delete(path: string): void {
    this._shouldDelete = true;
    this._resolve(path);
    this._shouldDelete = false;
  }

  clear(): void {
    this._config = {};
  }
}

// Singleton instance for backward compatibility
let configInstance: Configuration | null = null;

/**
 * Get the configuration instance.
 * Creates a new instance if none exists.
 */
export default function getConfig(): IConfiguration {
  if (!configInstance) {
    configInstance = new Configuration({});
  }
  return configInstance;
}
