import renderer from 'react-test-renderer';
import StateFormItem from '../../../../controllers/StateFormItem';
import StateForm from '../../../../controllers/StateForm';
import { StateJsxHtml } from '../../../../mui/form/items/state.jsx.html';

describe('src/mui/form/items/state.jsx.html.tsx', () => {

  describe('StateJsxHtml', () => {

    it('should render', () => {
      const form = new StateFormItem({
        type: 'html',

        // [TODO] Implement state to test this.

      }, {} as StateForm);
      const component = renderer.create(<StateJsxHtml def={form} />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

  });

});