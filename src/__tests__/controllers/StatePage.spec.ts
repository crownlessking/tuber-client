import StatePage from '../../controllers/StatePage';

describe('StatePage', () => {
  describe('constructor', () => {
    it('should create a state page object', () => {
      expect(new StatePage({})).toEqual({ _pageState: {} });
    });
  });
});