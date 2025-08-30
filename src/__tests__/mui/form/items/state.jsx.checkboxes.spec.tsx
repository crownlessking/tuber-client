import renderer from 'react-test-renderer';
import StateFormItemCheckboxes from '../../../../controllers/templates/StateFormItemCheckbox';
import StateForm from '../../../../controllers/StateForm';
import StateJsxCheckboxes from '../../../../mui/form/items/state.jsx.checkboxes';

describe('src/mui/form/items/state.jsx.checkboxes.tsx', () => {

  describe('StateJsxCheckboxes', () => {

    it('should render', () => {
      const form = new StateFormItemCheckboxes({
        type: 'checkboxes',

        // [TODO] Implement state to test this.

      }, {} as StateForm);
      const component = renderer.create(<StateJsxCheckboxes def={form} />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

  });

});