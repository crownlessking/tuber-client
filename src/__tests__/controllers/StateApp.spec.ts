import StateApp from '../../controllers/StateApp';

describe('StateApp', () => {
  describe('constructor', () => {
    it('should create a state app object', () => {
      expect(new StateApp({ title: ''})).toEqual({ _appState: {} });
    });
  });
});