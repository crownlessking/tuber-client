import StateForm from '../../controllers/StateForm';

describe('StateForm', () => {
  describe('constructor', () => {
    it('should create a state form object', () => {
      expect(new StateForm({})).toEqual({ _formState: {} });
    });
  });
});