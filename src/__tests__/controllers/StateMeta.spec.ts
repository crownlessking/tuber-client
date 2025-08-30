import StateMeta from '../../controllers/StateMeta';

describe('StateMeta', () => {
  describe('constructor', () => {
    it('should create a state meta object', () => {
      expect(new StateMeta({})).toEqual({ _metaState: {} });
    });
  });
});