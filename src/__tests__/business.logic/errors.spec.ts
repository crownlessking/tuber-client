import * as e from '../../business.logic/errors';

describe('business.logic/errors.ts', () => {
  describe('to_jsonapi_error', () => {
    it('should return an IJsonapiError', () => {
      const error = new Error('test');
      const result = e.to_jsonapi_error(error);
      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('detail');
      expect(result).toHaveProperty('meta');
    });
  });
  describe('remember_exception', () => {
    it('should add an error to the tmpErrorsList', () => {
      const error = new Error('test');
      e.remember_exception(error);
      const result = e.get_errors_list();
      expect(result).toHaveLength(1);
    });
  });
  describe('remember_error', () => {
    it('should add an error to the tmpErrorsList', () => {
      const error = { code: 'test', title: 'test', detail: 'test' };
      e.remember_error(error);
      const result = e.get_errors_list();
      expect(result).toHaveLength(1);
    });
  });
  describe('remember_jsonapi_errors', () => {
    it('should add an error to the tmpErrorsList', () => {
      const error = { code: 'test', title: 'test', detail: 'test' };
      e.remember_jsonapi_errors([error]);
      const result = e.get_errors_list();
      expect(result).toHaveLength(1);
    });
  });
  describe('remember_possible_error', () => {
    it('should add an error to the tmpErrorsList', () => {
      const error = { code: 'test', title: 'test', detail: 'test' };
      e.remember_possible_error('test', error);
      const result = e.get_errors_list();
      expect(result).toHaveLength(1);
    });
  });
  describe('get_errors_list', () => {
    it('should return the tmpErrorsList', () => {
      const result = e.get_errors_list();
      expect(result).toHaveLength(1);
    });
  });
});