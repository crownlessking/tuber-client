import renderer from 'react-test-renderer';
import DialogSelectNative from '../../../../../mui/dialog/form/select/native.select';
import StateFormItemSelect from '../../../../../controllers/templates/StateFormItemSelect';
import StateForm from 'src/controllers/StateForm';

describe('src/mui/dialog/form/select/native.select.tsx', () => {
  const hive = {} as Record<string, unknown>;

  it('should render correctly', () => {
    const select = new StateFormItemSelect({
      type: 'state_select',

      // [TODO] Finish implementing this to test.

    }, {} as StateForm);
    const tree = renderer
      .create(<DialogSelectNative def={select} hive={hive} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});