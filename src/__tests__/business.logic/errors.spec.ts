import * as e from '../../business.logic/errors';
import store from '../../state';
import { errorsActions } from '../../slices/errors.slice';
import { IJsonapiError } from '../../interfaces/IJsonapi';

const { dispatch } = store;

describe('business.logic/errors.ts', () => {
  
  beforeEach(() => {
    // Clear errors before each test to ensure clean state
    dispatch(errorsActions.errorsClear());
  });

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
    it('should add an error to the Redux store', () => {
      const error = new Error('test');
      e.remember_exception(error);
      const result = e.get_errors_list();
      expect(result).toHaveLength(1);
    });
  });
  describe('remember_error', () => {
    it('should add an error to the Redux store', () => {
      const error: IJsonapiError = { code: 'INTERNAL_ERROR', title: 'test', detail: 'test' };
      e.remember_error(error);
      const result = e.get_errors_list();
      expect(result).toHaveLength(1);
    });
  });
  describe('remember_jsonapi_errors', () => {
    it('should add an error to the Redux store', () => {
      const error: IJsonapiError = { code: 'INTERNAL_ERROR', title: 'test', detail: 'test' };
      e.remember_jsonapi_errors([error]);
      const result = e.get_errors_list();
      expect(result).toHaveLength(1);
    });
  });
  describe('remember_possible_error', () => {
    it('should add an error to the Redux store', () => {
      const error: IJsonapiError = { code: 'INTERNAL_ERROR', title: 'test', detail: 'test' };
      e.remember_possible_error(error);
      const result = e.get_errors_list();
      expect(result).toHaveLength(1);
    });
  });
  describe('get_errors_list', () => {
    it('should return the errors from Redux store', () => {
      // Add an error first
      const error: IJsonapiError = { code: 'INTERNAL_ERROR', title: 'test', detail: 'test' };
      e.remember_error(error);
      const result = e.get_errors_list();
      expect(result).toHaveLength(1);
    });
  });
  
  describe('clear_errors', () => {
    it('should clear all errors from Redux store', () => {
      // Add some errors first
      const error1: IJsonapiError = { code: 'EXCEPTION', title: 'test1', detail: 'test1' };
      const error2: IJsonapiError = { code: 'BAD_VALUE', title: 'test2', detail: 'test2' };
      e.remember_error(error1);
      e.remember_error(error2);
      
      // Verify errors were added
      expect(e.get_errors_list()).toHaveLength(2);
      
      // Clear errors
      e.clear_errors();
      
      // Verify errors were cleared
      expect(e.get_errors_list()).toHaveLength(0);
    });
  });
});