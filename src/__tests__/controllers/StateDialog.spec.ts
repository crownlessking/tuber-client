import StateDialog from '../../controllers/StateDialog';

describe('StateDialog', () => {
  describe('constructor', () => {
    it('should create a state dialog object', () => {
      expect(new StateDialog({})).toEqual({ _dialogState: {} });
    });
  });
});