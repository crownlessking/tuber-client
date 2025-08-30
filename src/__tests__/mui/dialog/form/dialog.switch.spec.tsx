import renderer from 'react-test-renderer';
import DialogSwitch from '../../../../mui/dialog/form/dialog.switch';
import StateFormItemSwitch from '../../../../controllers/templates/StateFormItemSwitch';
import StateForm from 'src/controllers/StateForm';

describe('src/mui/dialog/form/dialog.switch.tsx', () => {

  const hive = {} as Record<string, unknown>;

  it('should render correctly', () => {
    const def = new StateFormItemSwitch({
      type: 'single_switch',

      // [TODO] Finish implementing this to test.

    }, {} as StateForm);
    const tree = renderer
      .create(<DialogSwitch def={def} hive={hive} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});