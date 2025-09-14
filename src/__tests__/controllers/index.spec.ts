import * as F from '../../controllers';

describe('src/controllers/index.ts', () => {

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

