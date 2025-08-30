import State from '../../controllers/State';

describe('State', () => {
  describe('constructor', () => {
    it('should create a state object', () => {
      const state = new State();
      expect(state).toEqual({
        _state: {}
      });
    });
  });
});