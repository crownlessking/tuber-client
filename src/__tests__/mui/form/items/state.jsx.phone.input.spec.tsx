import renderer from 'react-test-renderer';
import StateFormItemInput from '../../../../controllers/templates/StateFormItemInput';
import StateForm from '../../../../controllers/StateForm';
import StateJsxInput from '../../../../mui/form/items/state.jsx.input';

describe('src/mui/form/items/state.jsx.input.tsx', () => {

  describe('StateJsxInput', () => {

    it('should render', () => {
      const form = new StateFormItemInput({
        type: 'phone_input',

        // [TODO] Implement state to test this.

      }, {} as StateForm);
      const component = renderer.create(<StateJsxInput def={form} />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

  });

});