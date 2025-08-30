import * as bl from '../../business.logic';

describe('src/business.logic', () => {

  describe('get_appbar_input_val', () => {
      it('should return empty string when route is not in queries', () => {
        const queries = {
          '/': { 'value': '', 'mode': 'search' }
        } as Record<string, { value?: string; mode?: 'search' | 'filter'}>;
        const route = '/bar'
        const result = bl.get_appbar_input_val(queries, route)
        expect(result).toBe('')
      });
  
      it('should return empty string when route is in queries but has no value', () => {
        const queries = {
          '/': { 'value': '', 'mode': 'search' }
        } as Record<string, { value?: string; mode?: 'search' | 'filter'}>;
        const route = '/bar'
        const result = bl.get_appbar_input_val(queries, route)
        expect(result).toBe('')
      });
  
      it('should return value when route is in queries and has value', () => {
        const queries = {
          '/': { 'value': '', 'mode': 'search' }
        } as Record<string, { value?: string; mode?: 'search' | 'filter'}>;
        const route = '/bar'
        const result = bl.get_appbar_input_val(queries, route)
        expect(result).toBe('baz')
      });

      it('Beginning forward slash can be omitted', () => {
        const queries = {
          '/': { 'value': '', 'mode': 'search' }
        } as Record<string, { value?: string; mode?: 'search' | 'filter'}>;
        const route = 'bar'
        const result = bl.get_appbar_input_val(queries, route)
        expect(result).toBe('baz')
      });
  });

  describe('get_global_var', () => {
    it('should return an empty object when the variable does not exist', () => {
      const result = bl.get_global_var('foo')
      expect(result).toEqual({})
    })
  })

  describe('get_val', () => {
    const testObj = {
      name: 'John',
      account: {
        user: {
          lastname: 'Doe',
          age: 30
        },
        settings: {
          theme: 'dark'
        }
      },
      items: ['apple', 'banana', { fruit: 'orange', count: 5 }],
      mixed: {
        data: [
          { id: 1, value: 'first' },
          { id: 2, value: 'second' }
        ]
      }
    };

    it('should return value for simple property path', () => {
      expect(bl.get_val(testObj, 'name')).toBe('John');
    });

    it('should return value for nested object path', () => {
      expect(bl.get_val(testObj, 'account.user.lastname')).toBe('Doe');
      expect(bl.get_val(testObj, 'account.user.age')).toBe(30);
      expect(bl.get_val(testObj, 'account.settings.theme')).toBe('dark');
    });

    it('should return value for array index path', () => {
      expect(bl.get_val(testObj, 'items.0')).toBe('apple');
      expect(bl.get_val(testObj, 'items.1')).toBe('banana');
    });

    it('should return value for mixed object/array path', () => {
      expect(bl.get_val(testObj, 'items.2.fruit')).toBe('orange');
      expect(bl.get_val(testObj, 'items.2.count')).toBe(5);
      expect(bl.get_val(testObj, 'mixed.data.0.id')).toBe(1);
      expect(bl.get_val(testObj, 'mixed.data.1.value')).toBe('second');
    });

    it('should handle whitespace in path', () => {
      expect(bl.get_val(testObj, ' name ')).toBe('John');
      expect(bl.get_val(testObj, ' account . user . lastname ')).toBe('Doe');
      expect(bl.get_val(testObj, 'items . 0 ')).toBe('apple');
    });

    it('should return undefined for non-existent paths', () => {
      expect(bl.get_val(testObj, 'nonexistent')).toBeUndefined();
      expect(bl.get_val(testObj, 'account.nonexistent')).toBeUndefined();
      expect(bl.get_val(testObj, 'account.user.nonexistent')).toBeUndefined();
      expect(bl.get_val(testObj, 'items.10')).toBeUndefined();
    });

    it('should return undefined for invalid object inputs', () => {
      expect(bl.get_val(null, 'name')).toBeUndefined();
      expect(bl.get_val(undefined, 'name')).toBeUndefined();
      expect(bl.get_val('string', 'name')).toBeUndefined();
      expect(bl.get_val(123, 'name')).toBeUndefined();
      expect(bl.get_val(true, 'name')).toBeUndefined();
    });

    it('should handle empty path', () => {
      expect(bl.get_val(testObj, '')).toBeUndefined();
    });

    it('should handle paths that encounter null/undefined values', () => {
      const objWithNulls = {
        data: null,
        nested: {
          value: undefined
        }
      };
      expect(bl.get_val(objWithNulls, 'data.something')).toBeUndefined();
      expect(bl.get_val(objWithNulls, 'nested.value.something')).toBeUndefined();
    });

    it('should handle array as root object', () => {
      const arr = ['first', 'second', { nested: 'value' }];
      expect(bl.get_val(arr, '0')).toBe('first');
      expect(bl.get_val(arr, '1')).toBe('second');
      expect(bl.get_val(arr, '2.nested')).toBe('value');
    });

    it('should return typed values when using generic', () => {
      const result1 = bl.get_val<string>(testObj, 'name');
      expect(result1).toBe('John');
      
      const result2 = bl.get_val<number>(testObj, 'account.user.age');
      expect(result2).toBe(30);
      
      const result3 = bl.get_val<object>(testObj, 'account.user');
      expect(result3).toEqual({ lastname: 'Doe', age: 30 });
    });

    it('should handle deep nesting', () => {
      const deepObj = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: 'deep value'
              }
            }
          }
        }
      };
      expect(bl.get_val(deepObj, 'level1.level2.level3.level4.level5')).toBe('deep value');
    });

    it('should handle invalid array indices', () => {
      expect(bl.get_val(testObj, 'items.abc')).toBeUndefined();
      expect(bl.get_val(testObj, 'items.-1')).toBeUndefined();
    });

    it('should handle paths that try to traverse non-objects', () => {
      expect(bl.get_val(testObj, 'name.something')).toBeUndefined();
      expect(bl.get_val(testObj, 'account.user.age.something')).toBeUndefined();
    });

    it('should handle floating point array indices', () => {
      expect(bl.get_val(testObj, 'items.1.5')).toBeUndefined();
      expect(bl.get_val(testObj, 'items.0.1')).toBeUndefined();
    });

    it('should handle boolean values in paths', () => {
      const objWithBooleans = {
        active: true,
        disabled: false,
        user: { isActive: true }
      };
      expect(bl.get_val(objWithBooleans, 'active')).toBe(true);
      expect(bl.get_val(objWithBooleans, 'disabled')).toBe(false);
      expect(bl.get_val(objWithBooleans, 'user.isActive')).toBe(true);
    });

    it('should handle zero and falsy values', () => {
      const objWithFalsyValues = {
        zero: 0,
        emptyString: '',
        nullValue: null,
        undefinedValue: undefined,
        nested: {
          zero: 0,
          empty: ''
        }
      };
      expect(bl.get_val(objWithFalsyValues, 'zero')).toBe(0);
      expect(bl.get_val(objWithFalsyValues, 'emptyString')).toBe('');
      expect(bl.get_val(objWithFalsyValues, 'nullValue')).toBe(null);
      expect(bl.get_val(objWithFalsyValues, 'undefinedValue')).toBe(undefined);
      expect(bl.get_val(objWithFalsyValues, 'nested.zero')).toBe(0);
      expect(bl.get_val(objWithFalsyValues, 'nested.empty')).toBe('');
    });

    it('should handle nested arrays', () => {
      const objWithNestedArrays = {
        matrix: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]
        ],
        complex: [
          { data: [{ value: 'a' }, { value: 'b' }] },
          { data: [{ value: 'c' }, { value: 'd' }] }
        ]
      };
      expect(bl.get_val(objWithNestedArrays, 'matrix.0.1')).toBe(2);
      expect(bl.get_val(objWithNestedArrays, 'matrix.2.2')).toBe(9);
      expect(bl.get_val(objWithNestedArrays, 'complex.0.data.1.value')).toBe('b');
      expect(bl.get_val(objWithNestedArrays, 'complex.1.data.0.value')).toBe('c');
    });

    it('should handle single character paths', () => {
      const singleCharObj = {
        a: 'letter a',
        b: { c: 'nested c' },
        1: 'number one'
      };
      expect(bl.get_val(singleCharObj, 'a')).toBe('letter a');
      expect(bl.get_val(singleCharObj, 'b')).toEqual({ c: 'nested c' });
      expect(bl.get_val(singleCharObj, '1')).toBe('number one');
    });

    it('should handle paths with consecutive dots', () => {
      expect(bl.get_val(testObj, 'account..user')).toBeUndefined();
      expect(bl.get_val(testObj, 'account...user')).toBeUndefined();
      expect(bl.get_val(testObj, '..name')).toBeUndefined();
    });

    it('should handle numeric string properties vs array indices', () => {
      const mixedObj = {
        '0': 'string key zero',
        '1': 'string key one',
        items: ['array zero', 'array one']
      };
      expect(bl.get_val(mixedObj, '0')).toBe('string key zero');
      expect(bl.get_val(mixedObj, '1')).toBe('string key one');
      expect(bl.get_val(mixedObj, 'items.0')).toBe('array zero');
      expect(bl.get_val(mixedObj, 'items.1')).toBe('array one');
    });

    it('should handle very long paths', () => {
      const deepObj = {
        a: { b: { c: { d: { e: { f: { g: { h: { i: { j: 'deep value' } } } } } } } } }
      };
      expect(bl.get_val(deepObj, 'a.b.c.d.e.f.g.h.i.j')).toBe('deep value');
    });

    it('should handle objects with prototype properties', () => {
      const proto = { inherited: 'inherited value' };
      const obj = Object.create(proto);
      obj.own = 'own value';
      
      expect(bl.get_val(obj, 'own')).toBe('own value');
      expect(bl.get_val(obj, 'inherited')).toBe('inherited value');
    });

    it('should handle sparse arrays', () => {
      const sparseArray = [] as string[];
      sparseArray[0] = 'first';
      sparseArray[5] = 'sixth';
      
      expect(bl.get_val(sparseArray, '0')).toBe('first');
      expect(bl.get_val(sparseArray, '1')).toBeUndefined();
      expect(bl.get_val(sparseArray, '5')).toBe('sixth');
    });

    it('should handle path with only whitespace', () => {
      expect(bl.get_val(testObj, '   ')).toBeUndefined();
      expect(bl.get_val(testObj, '\t\n')).toBeUndefined();
    });
  });

  describe('get_endpoint_ending_fixed', () => {
    it('should return empty string when endpoint is undefined', () => {
      const result = bl.get_endpoint_ending_fixed(undefined);
      expect(result).toBe('');
    });

    it('should return empty string when endpoint is empty string', () => {
      const result = bl.get_endpoint_ending_fixed('');
      expect(result).toBe('');
    });

    it('should return empty string when endpoint has ending forward slash', () => {
      const result = bl.get_endpoint_ending_fixed('foo/');
      expect(result).toBe('foo/');
    });

    it('should return empty string when endpoint has no ending forward slash', () => {
      const result = bl.get_endpoint_ending_fixed('foo');
      expect(result).toBe('foo/');
    });
  });

  describe('clean_endpoint_ending', () => {
    it('should return empty string when endpoint is undefined', () => {
      const result = bl.clean_endpoint_ending(undefined);
      expect(result).toBe('');
    });

    it('should return empty string when endpoint is empty string', () => {
      const result = bl.clean_endpoint_ending('');
      expect(result).toBe('');
    });

    it('should return empty string when endpoint has ending forward slash', () => {
      const result = bl.clean_endpoint_ending('foo/');
      expect(result).toBe('foo');
    });

    it('should return empty string when endpoint has no ending forward slash', () => {
      const result = bl.clean_endpoint_ending('foo');
      expect(result).toBe('foo');
    });
  });

  describe('get_query_starting_fixed', () => {
    it('should return empty string when query is undefined', () => {
      const result = bl.get_query_starting_fixed(undefined);
      expect(result).toBe('');
    });

    it('should return empty string when query is empty string', () => {
      const result = bl.get_query_starting_fixed('');
      expect(result).toBe('');
    });

    it('should return empty string when query has starting question mark', () => {
      const result = bl.get_query_starting_fixed('?foo');
      expect(result).toBe('?foo');
    });

    it('should return empty string when query has no starting question mark', () => {
      const result = bl.get_query_starting_fixed('foo');
      expect(result).toBe('?foo');
    });
  });

  describe('safely_get_as', () => {
    it('should return default value when object is undefined', () => {
      const result = bl.safely_get_as({}, 'foo', 'bar');
      expect(result).toBe('bar');
    });

    it('should return default value when nested value not found', () => {
      const result = bl.safely_get_as({ 'foo': {} }, 'foo.name', 'bar');
      expect(result).toBe('bar');
    });

    it('should return default value when path is not found', () => {
      const result = bl.safely_get_as({ 'bar': { 'foo': {}}}, 'foo', 'bar');
      expect(result).toBe('bar');
    });

    it('should return value when path is found', () => {
      const result = bl.safely_get_as({ foo: 'baz' }, 'foo', 'bar');
      expect(result).toBe('baz');
    });

    it('should return nested value from path', () => {
      const result = bl.safely_get_as({ foo: {baz: { bar: 1 }}}, 'foo.baz.bar', 'bar');
      expect(result).toBe(1);
    });
  });

  describe('set_url_query_val', () => {
    it('should return empty string when url is empty', () => {
      const result = bl.set_url_query_val('', 'foo');
      expect(result).toBe('');
    });

    it('should return empty string when url is empty string', () => {
      const result = bl.set_url_query_val('', 'foo');
      expect(result).toBe('');
    });

    it('should return empty string when param is empty', () => {
      const result = bl.set_url_query_val('foo', '');
      expect(result).toBe('');
    });

    it('should return empty string when param is empty string', () => {
      const result = bl.set_url_query_val('foo', '');
      expect(result).toBe('');
    });

    it('should return url with query string when query string is not present', () => {
      const result = bl.set_url_query_val('foo', 'bar');
      expect(result).toBe('foo?bar');
    });

    it('should return url with query string when query string is present', () => {
      const result = bl.set_url_query_val('foo?baz', 'bar');
      expect(result).toBe('foo?baz&bar');
    });

    it('should return url with query string when query string is present and has value', () => {
      const result = bl.set_url_query_val('foo?baz=bar', 'bar');
      expect(result).toBe('foo?baz=bar&bar');
    });
  });

  describe('get_state_form_name', () => {
    it('should return empty string when formKey is empty string', () => {
      const result = bl.get_state_form_name('');
      expect(result).toBe('');
    });

    it('Inserts the suffix \'Form\' if it is missing', () => {
      const result = bl.get_state_form_name('foo');
      expect(result).toBe('fooForm');
    });

    it('If form name contains the suffix, simply returns it', () => {
      const result = bl.get_state_form_name('fooForm');
      expect(result).toBe('fooForm');
    });
  });

  describe('get_state_dialog_name', () => {
    it('should return empty string when dialogKey is empty string', () => {
      const result = bl.get_state_dialog_name('');
      expect(result).toBe('');
    });

    it('Inserts the suffix \'Dialog\' if it is missing', () => {
      const result = bl.get_state_dialog_name('foo');
      expect(result).toBe('fooDialog');
    });

    it('If dialog name contains the suffix, simply returns it', () => {
      const result = bl.get_state_dialog_name('fooDialog');
      expect(result).toBe('fooDialog');
    });
  });

  describe('mongo_object_id', () => {
    it('should return a string', () => {
      const result = bl.mongo_object_id();
      expect(typeof result).toBe('string');
    });
  });

  describe('trim_slashes', () => {
    it('should return empty string when url is empty', () => {
      const result = bl.trim_slashes('');
      expect(result).toBe('');
    });

    it('should return empty string when url is empty string', () => {
      const result = bl.trim_slashes('');
      expect(result).toBe('');
    });

    it('should return empty string when url has only forward slashes', () => {
      const result = bl.trim_slashes('////');
      expect(result).toBe('');
    });

    it('should return url with no forward slashes when url has only forward slashes', () => {
      const result = bl.trim_slashes('////foo////');
      expect(result).toBe('foo');
    });
  });

  describe('get_endpoint', () => {
    it('should return empty string when url is empty', () => {
      const result = bl.get_endpoint('');
      expect(result).toBe('');
    });

    it('should return empty string when url is empty string', () => {
      const result = bl.get_endpoint('');
      expect(result).toBe('');
    });

    it('should return empty string when url has no forward slashes test 1', () => {
      const result = bl.get_endpoint('foo');
      expect(result).toBe('');
    });

    it('should return empty string when url has no forward slashes test 2', () => {
      const result = bl.get_endpoint('foo');
      expect(result).toBe('');
    });

    it('should return endpoint when url has forward slashes test 1', () => {
      const result = bl.get_endpoint('foo/bar');
      expect(result).toBe('bar');
    });

    it('should return endpoint when url has forward slashes test 2', () => {
      const result = bl.get_endpoint('foo/bar/baz');
      expect(result).toBe('baz');
    });
  });

  describe('http_get', () => {
    it('should return empty string when url is empty', () => {
      const result = bl.http_get('');
      expect(result).toBe('');
    });

    it('should return empty string when url is empty string', () => {
      const result = bl.http_get('');
      expect(result).toBe('');
    });

    it('should return empty string when url has no forward slashes test 1', () => {
      const result = bl.http_get('foo');
      expect(result).toBe('');
    });

    it('should return empty string when url has no forward slashes test 2', () => {
      const result = bl.http_get('foo');
      expect(result).toBe('');
    });

    it('should return endpoint when url has forward slashes test 1', () => {
      const result = bl.http_get('foo/bar');
      expect(result).toBe('bar');
    });

    it('should return endpoint when url has forward slashes test 2', () => {
      const result = bl.http_get('foo/bar/baz');
      expect(result).toBe('baz');
    });
  });

  describe('get_themed_state', () => {
    it('should return main state when light and dark states are undefined', () => {
      const result = bl.get_themed_state('dark', 'foo', undefined, undefined);
      expect(result).toBe('foo');
    });

    it('should return main state when light and dark states are null', () => {
      const result = bl.get_themed_state('dark', 'foo', null, null);
      expect(result).toBe('foo');
    });

    it('should return main state when light and dark states are not objects', () => {
      const result = bl.get_themed_state('dark', 'foo', 1, 1);
      expect(result).toBe('foo');
    });

    it('should return main state when light and dark states are arrays', () => {
      const result = bl.get_themed_state('dark', 'foo', [], []);
      expect(result).toBe('foo');
    });

    it('should return light state when mode is light and light state is defined', () => {
      const result = bl.get_themed_state('light', 'foo', 'bar', undefined);
      expect(result).toBe('bar');
    });

    it('should return dark state when mode is dark and dark state is defined', () => {
      const result = bl.get_themed_state('dark', 'foo', undefined, 'bar');
      expect(result).toBe('bar');
    });
  });

  describe('parse_cookies', () => {
    it('should return empty object when document.cookie is empty', () => {
      const result = bl.parse_cookies();
      expect(result).toEqual({});
    });

    it('should return empty object when document.cookie is empty string', () => {
      const result = bl.parse_cookies();
      expect(result).toEqual({});
    });

    it('should return object with key and value when document.cookie has one cookie', () => {
      const result = bl.parse_cookies();
      expect(result).toEqual({});
    });

    it('should return object with key and value when document.cookie has multiple cookies', () => {
      const result = bl.parse_cookies();
      expect(result).toEqual({});
    });
  });

  describe('get_cookie', () => {
    it('should return empty string when cookie name is empty', () => {
      const result = bl.get_cookie('');
      expect(result).toBe('');
    });

    it('should return empty string when cookie name is empty string', () => {
      const result = bl.get_cookie('');
      expect(result).toBe('');
    });

    it('should return empty string when cookie name is not found', () => {
      const result = bl.get_cookie('foo');
      expect(result).toBe('');
    });

    it('should return value when cookie name is found', () => {
      const result = bl.get_cookie('foo');
      expect(result).toBe('');
    });
  });
});