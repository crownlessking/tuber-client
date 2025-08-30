import StateFormItem from '../../controllers/StateFormItem';

describe('StateFormItem', () => {
  describe('constructor', () => {
    it('should create a state form item object', () => {
      expect(new StateFormItem({ type: 'a' }, null)).toEqual({ _formItemState: {} });
    });
  });
});