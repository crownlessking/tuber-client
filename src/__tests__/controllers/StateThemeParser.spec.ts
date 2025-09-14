import ThemeParser from '../../controllers/StateThemeParser';

describe('ThemeParser', () => {
  describe('constructor', () => {
    it('should create a theme parser object', () => {
      expect(new ThemeParser({})).toEqual({ _themeParser: {} });
    });
  });
});