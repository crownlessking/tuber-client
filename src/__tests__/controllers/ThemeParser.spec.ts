import ThemeParser from '../../controllers/ThemeParser';

describe('ThemeParser', () => {
  describe('constructor', () => {
    it('should create a theme parser object', () => {
      expect(new ThemeParser({})).toEqual({ _themeParser: {} });
    });
  });
});