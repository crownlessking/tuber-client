import * as F from '../../controllers';

describe('src/controllers/index.ts', () => {
  
  describe('get_viewport_size', () => {
    it('returns the viewport size', () => {
      const size = F.get_viewport_size();
      expect(size.height).toBeGreaterThan(0);
      expect(size.width).toBeGreaterThan(0);
    });
  });
  
  describe('stretch_to_bottom', () => {
    it('returns the height of the viewport minus the height of the element', () => {
      const size = F.stretch_to_bottom(10);
      expect(size).not.toBeUndefined();
    });
  });

  describe('get_val', () => {
    it('returns the value of the given key', () => {
      const obj = { a: 1, b: 2 };
      const val = F.get_val(obj, 'b');
      expect(val).toEqual(2);
    });
    it('returns null if the key is not found', () => {
      const obj = { a: 1, b: 2 };
      const val = F.get_val(obj, 'c');
      expect(val).toBeNull();
    });
  });

  describe('set_val', () => {
    it('sets the value of the given key', () => {
      const obj = { a: 1, b: 2 };
      F.set_val(obj, 'b', 3);
      expect(obj.b).toEqual(3);
    });
    it('creates a key by setting its value', () => {
      const obj = { a: 1, b: 2 };
      F.set_val(obj, 'c', 3);
      expect(obj['c']).toEqual(3);
    });
  });

  describe ('get_query_val', () => {
    it('returns the value of the given key in the query string', () => {
      const val = F.get_query_val('a', '?a=1&b=2');
      expect(val).toEqual('1');
    });
    it('returns null if the key is not found', () => {
      const val = F.get_query_val('c', '?a=1&b=2');
      expect(val).toBeNull();
    });
  });

  describe ('get_query_keys', () => {
    it('returns the keys of the query string', () => {
      const keys = F.get_query_keys('?a=1&b=2');
      expect(keys).toEqual(['a', 'b']);
    });
    it('returns an empty array if the query string is empty', () => {
      const keys = F.get_query_keys('');
      expect(keys).toEqual([]);
    });
  });

  describe ('get_query_values', () => {
    it('returns the values of the query string', () => {
      const values = F.get_query_values('?a=1&b=2');
      expect(values).toEqual(['1', '2']);
    });
    it('returns an empty array if the query string is empty', () => {
      const values = F.get_query_values('');
      expect(values).toEqual([]);
    });
  });

  describe ('set_url_query_val', () => {
    it('sets the value of the given key in the query string', () => {
      const url = F.set_url_query_val('a', '3', '?a=1&b=2');
      expect(url).toEqual('?a=3&b=2');
    });
    it('creates a key by setting its value', () => {
      const url = F.set_url_query_val('c', '3', '?a=1&b=2');
      expect(url).toEqual('?a=1&b=2&c=3');
    });
  });

  describe ('delete_range', () => {
    it('deletes the given range from the given array', () => {
      const arr = [1, 2, 3, 4, 5];
      F.delete_range(arr, 1, 3);
      expect(arr).toEqual([1, 5]);
    });
  });

  describe ('get_head_meta_content', () => {
    it('returns the content of the meta tag with the given name', () => {
      const content = F.get_head_meta_content('description');
      expect(content).toEqual('A React app for searching the GitHub API.');
    });
    it('returns an empty string if the meta tag is not found', () => {
      const content = F.get_head_meta_content('foo');
      expect(content).toEqual('');
    });
  });

  describe ('camelize', () => {
    it('returns the camelized version of the given string', () => {
      const str = F.camelize('foo-bar');
      expect(str).toEqual('fooBar');
    });
  });

  describe ('safely_get', () => {
    it('returns the value of the given key', () => {
      const obj = { a: 1, b: 2 };
      const val = F.safely_get(obj, 'b');
      expect(val).toEqual(2);
    });
    it('returns null if the key is not found', () => {
      const obj = { a: 1, b: 2 };
      const val = F.safely_get(obj, 'c');
      expect(val).toBeNull();
    });
  });

  describe ('safely_get_as', () => {
    it('returns the value of the given key', () => {
      const obj = { a: 1, b: 2 };
      const val = F.safely_get_as(obj, 'b', 'string');
      expect(val).toEqual(2);
    });
    it('returns null if the key is not found', () => {
      const obj = { a: 1, b: 2 };
      const val = F.safely_get_as(obj, 'c', 'string');
      expect(val).toBeNull();
    });
    it('returns null if the value is not of the given type', () => {
      const obj = { a: 1, b: 2 };
      const val = F.safely_get_as(obj, 'b', 'string');
      expect(val).toBeNull();
    });
  });

  describe ('get_parsed_page_content', () => {
    it('returns the parsed page content', () => {
      const content = F.get_parsed_page_content();
      expect(content).not.toBeUndefined();
    });
  });

  describe ('jsonapi_fleetly_index', () => {
    it('returns the parsed page content', () => {
      const content = F.jsonapi_fleetly_index([]);
      expect(content).not.toBeUndefined();
    });
  });

  describe ('get_base_route', () => {
    it('returns the base route', () => {
      const route = F.get_base_route();
      expect(route).toEqual('/');
    });
  });

  describe ('get_path_vars', () => {
    it('returns the path variables', () => {
      const vars = F.get_path_vars('/foo/:bar');
      expect(vars).toEqual(['bar']);
    });
  });

  describe ('route_match_template', () => {
    it('returns true if the route matches the template', () => {
      const match = F.route_match_template('/foo/:bar', '/foo/1');
      expect(match).toBeTruthy();
    })
    it('returns false if the route does not match the template', () => {
      const match = F.route_match_template('/foo/:bar', '/foo');
      expect(match).toBeFalsy();
    });
  });

  describe ('has_path_vars', () => {
    it('returns true if the route has path variables', () => {
      const match = F.has_path_vars('/foo/:bar');
      expect(match).toBeTruthy();
    });
    it('returns false if the route does not have path variables', () => {
      const match = F.has_path_vars('/foo');
      expect(match).toBeFalsy();
    });
  });

  describe ('no_path_vars', () => {
    it('returns true if the route does not have path variables', () => {
      const match = F.no_path_vars('/foo');
      expect(match).toBeTruthy();
    });
    it('returns false if the route has path variables', () => {
      const match = F.no_path_vars('/foo/:bar');
      expect(match).toBeFalsy();
    });
  });

  describe ('is_template_route', () => {
    it('returns true if the route is a template route', () => {
      const match = F.is_template_route('/foo/:bar');
      expect(match).toBeTruthy();
    });
    it('returns false if the route is not a template route', () => {
      const match = F.is_template_route('/foo');
      expect(match).toBeFalsy();
    });
  });
});

