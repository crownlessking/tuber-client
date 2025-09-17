import StateHandleFactory, { parseStringDirective } from '../../controllers/StateHandleFactory';
import { post_fetch, post_req_state } from '../../state/net.actions';
import store, { actions } from '../../state';
import JsonapiRequest from '../../business.logic/JsonapiRequest';
import FormValidationPolicy from '../../business.logic/FormValidationPolicy';
import StateNet from '../../controllers/StateNet';
import Config from '../../config';

// src/controllers/StateHandleFactory.test.ts

jest.mock('../../state/net.actions');
jest.mock('../../state', () => ({
  __esModule: true,
  default: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
  actions: {
    dynamicRegistryAdd: jest.fn(),
    formsDataClear: jest.fn(),
    dialogClose: jest.fn(),
  },
}));
jest.mock('../../controllers/jsonapi.request');
jest.mock('../../controllers/FormValidationPolicy');
jest.mock('../../controllers/StateNet');
jest.mock('../../config');
jest.mock('../../business.logic/logging', () => ({
  ler: jest.fn(),
  pre: jest.fn(),
}));
jest.mock('../../business.logic/errors', () => ({
  remember_jsonapi_errors: jest.fn(),
}));
jest.mock('../../business.logic/utility', () => ({
  get_origin_ending_fixed: jest.fn(() => 'http://origin/'),
  get_val: jest.fn((obj, key) => obj[key]),
  get_head_meta_content: jest.fn(() => 'mocked-content'),
  is_record: jest.fn(() => true),
}));

describe('parseStringDirective', () => {
  it('parses directive string correctly', () => {
    expect(parseStringDirective('$form : myForm : /api/endpoint : /route')).toEqual({
      type: '$form',
      formName: 'myForm',
      endpoint: '/api/endpoint',
      route: '/route',
    });
    expect(parseStringDirective('$none')).toEqual({
      type: '$none',
      formName: undefined,
      endpoint: undefined,
      route: undefined,
    });
  });
});

describe('StateHandleFactory', () => {
  let directive;
  let factory;
  let mockState;

  beforeEach(() => {
    directive = {
      type: '$form',
      formName: 'myForm',
      endpoint: '/api/endpoint',
      route: '/route',
      load: { foo: 'bar' },
    };
    mockState = {
      pathnames: { foo: '/foo' },
      net: {},
      app: { origin: 'http://origin' },
      dynamicRegistry: {},
    };
    (store.getState as jest.Mock).mockReturnValue(mockState);
    (StateNet as jest.Mock).mockImplementation(() => ({ headers: { 'x': 'y' } }));
    (Config.read as jest.Mock).mockReturnValue('dark');
    factory = new StateHandleFactory(directive);
    jest.clearAllMocks();
  });

  describe('_isAlreadyLoaded', () => {
    it('returns true if already loaded', () => {
      mockState.dynamicRegistry = { 'foo.bar': 1 };
      expect(factory['_isAlreadyLoaded']('foo', 'bar')).toBe(true);
    });
    it('returns false if not loaded', () => {
      mockState.dynamicRegistry = {};
      expect(factory['_isAlreadyLoaded']('foo', 'bar')).toBe(false);
    });
  });

  describe('_loadSingleStateFragment', () => {
    it('returns undefined if already loaded', async () => {
      mockState.dynamicRegistry = { 'foo.bar': 1 };
      const result = await factory['_loadSingleStateFragment']('foo', 'bar');
      expect(result).toBeUndefined();
    });
    it('dispatches state and registry on success', async () => {
      mockState.dynamicRegistry = {};
      (post_fetch as jest.Mock).mockResolvedValue({ state: { a: 1 } });
      const result = await factory['_loadSingleStateFragment']('foo', 'bar');
      expect(store.dispatch).toHaveBeenCalled();
      expect(result).toEqual({ a: 1 });
    });
    it('handles errors', async () => {
      (post_fetch as jest.Mock).mockResolvedValue({ errors: [{ title: 'Error!' }] });
      const result = await factory['_loadSingleStateFragment']('foo', 'bar');
      expect(result).toBeUndefined();
    });
  });

  describe('_loadMultipleStateFragments', () => {
    it('returns array of states', async () => {
      (post_fetch as jest.Mock)
        .mockResolvedValueOnce({ state: { a: 1 } })
        .mockResolvedValueOnce({ state: { b: 2 } });
      const result = await factory['_loadMultipleStateFragments']('foo', ['bar', 'baz']);
      expect(result).toEqual([{ a: 1 }, { b: 2 }]);
    });
    it('filters out undefined', async () => {
      (post_fetch as jest.Mock)
        .mockResolvedValueOnce({ errors: [{ title: 'Error!' }] })
        .mockResolvedValueOnce({ state: { b: 2 } });
      const result = await factory['_loadMultipleStateFragments']('foo', ['bar', 'baz']);
      expect(result).toEqual([{ b: 2 }]);
    });
  });

  describe('_performLoadingTask', () => {
    it('calls _loadSingleStateFragment for string', async () => {
      factory['_loadSingleStateFragment'] = jest.fn().mockResolvedValue({});
      await factory['_performLoadingTask']();
      expect(factory['_loadSingleStateFragment']).toHaveBeenCalledWith('foo', 'bar');
    });
    it('calls _loadMultipleStateFragments for array', async () => {
      directive.load = { foo: ['bar', 'baz'] };
      factory = new StateHandleFactory(directive);
      factory['_loadMultipleStateFragments'] = jest.fn().mockResolvedValue([]);
      await factory['_performLoadingTask']();
      expect(factory['_loadMultipleStateFragments']).toHaveBeenCalledWith('foo', ['bar', 'baz']);
    });
  });

  describe('_submitFormData', () => {
    it('handles missing formName/endpoint', async () => {
      factory = new StateHandleFactory({ type: '$form' });
      await factory['_submitFormData']();
      expect(store.dispatch).not.toHaveBeenCalled();
    });
    it('handles validation errors', async () => {
      (FormValidationPolicy as jest.Mock).mockImplementation(() => ({
        applyValidationSchemes: () => [{ name: 'field', message: 'error' }],
        emit: jest.fn(),
      }));
      factory = new StateHandleFactory(directive);
      await factory['_submitFormData']();
      expect(store.dispatch).not.toHaveBeenCalledWith(post_req_state);
    });
    it('dispatches form data on success', async () => {
      (FormValidationPolicy as jest.Mock).mockImplementation(() => ({
        applyValidationSchemes: () => [],
        getFilteredData: () => ({ foo: 'bar' }),
        emit: jest.fn(),
      }));
      (JsonapiRequest as jest.Mock).mockImplementation(() => ({
        build: () => ({ data: 'payload' }),
      }));
      await factory['_submitFormData']();
      expect(store.dispatch).toHaveBeenCalledWith(post_req_state(directive.endpoint, { data: 'payload' }));
      expect(store.dispatch).toHaveBeenCalledWith(actions.formsDataClear(directive.formName));
    });
    it('closes dialog for $form_dialog', async () => {
      directive.type = '$form_dialog';
      factory = new StateHandleFactory(directive);
      (FormValidationPolicy as jest.Mock).mockImplementation(() => ({
        applyValidationSchemes: () => [],
        getFilteredData: () => ({}),
        emit: jest.fn(),
      }));
      (JsonapiRequest as jest.Mock).mockImplementation(() => ({
        build: () => ({}),
      }));
      await factory['_submitFormData']();
      expect(store.dispatch).toHaveBeenCalledWith(actions.dialogClose());
    });
  });

  describe('getDirectiveCallback', () => {
    it('returns submit callback for $form', () => {
      const cb = factory.getDirectiveCallback();
      expect(typeof cb).toBe('function');
    });
    it('returns submit callback for $form_dialog', () => {
      directive.type = '$form_dialog';
      factory = new StateHandleFactory(directive);
      const cb = factory.getDirectiveCallback();
      expect(typeof cb).toBe('function');
    });
    it('returns undefined for invalid type', () => {
      directive.type = '$invalid';
      factory = new StateHandleFactory(directive);
      const cb = factory.getDirectiveCallback();
      expect(cb).toBeUndefined();
    });
  });
});