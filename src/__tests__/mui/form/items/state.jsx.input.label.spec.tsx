import renderer from 'react-test-renderer';
import StateFormItem from '../../../../controllers/StateFormItem';
import StateForm from '../../../../controllers/StateForm';
import StateJsxInputLabel from '../../../../mui/form/items/state.jsx.input.label';

describe('src/mui/form/items/state.jsx.input.label.tsx', () => {

  describe('StateJsxInputLabel', () => {

    it('should render', () => {
      const form = new StateFormItem({
        type: 'input_label',

        // [TODO] Implement state to test this.

      }, {} as StateForm);
      const component = renderer.create(<StateJsxInputLabel def={form} />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

  });

});