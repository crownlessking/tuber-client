import renderer from 'react-test-renderer';
import StateJsxBadgedIcon, { JsxUnifiedIconProvider } from '../../mui/state.jsx.icons';
import StateFormItemCustom from '../../controllers/StateFormItemCustom';
import StateFormItem from '../../controllers/StateFormItem';

describe('src/mui/state.jsx.icons.tsx', () => {

  describe('StateJsxIcon', () => {

    it('should render', () => {
      const form = new StateFormItemCustom({

        // [TODO] Implement state to test.

      }, {} as StateFormItem);
      const component = renderer.create(<JsxUnifiedIconProvider def={form} />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

  });

  describe('StateJsxBadgedIcon', () => {

    it('should render', () => {
      const form = new StateFormItemCustom({

        // [TODO] Implement state to test.

      }, {} as StateFormItem);
      const component = renderer.create(<StateJsxBadgedIcon def={form} />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

  });

});