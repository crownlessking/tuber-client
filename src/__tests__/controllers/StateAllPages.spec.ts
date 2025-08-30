import StateAllPages from '../../controllers/StateAllPages';

describe('StateAllPages', () => {
  describe('constructor', () => {
    it('should create a state all pages object', () => {
      expect(new StateAllPages({})).toEqual({ _allPagesState: {} });
    });
  });
});