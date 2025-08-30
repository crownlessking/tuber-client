import StateSnackbar from '../../controllers/StateSnackbar';

describe('StateSnackbar', () => {
  describe('constructor', () => {
    it('should create a state snackbar object', () => {
      expect(new StateSnackbar({})).toEqual({ _snackbarState: {} });
    });
  });
});