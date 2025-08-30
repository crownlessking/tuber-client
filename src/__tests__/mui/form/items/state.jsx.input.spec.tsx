import renderer from 'react-test-renderer';
import StateFormItem from '../../../../controllers/StateFormItem';
import StateForm from '../../../../controllers/StateForm';
import StateJsxInput from 'src/mui/form/items/state.jsx.input';

describe('src/mui/form/items/state.jsx.input.tsx', () => {

  describe('StateJsxInput', () => {

    it('should render', () => {
      const form = new StateFormItem({
        type: 'state_input',

        // [TODO] Implement state to test this.

      }, {} as StateForm);
      const component = renderer.create(<StateJsxInput def={form} />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

  });

});