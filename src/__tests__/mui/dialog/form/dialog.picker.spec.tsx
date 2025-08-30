import renderer from 'react-test-renderer';
import DialogPicker from '../../../../mui/dialog/form/dialog.picker';
import StateFormItem from '../../../../controllers/StateFormItem';

describe('src/mui/dialog/form/dialog.picker.tsx', () => {

  const hive = {} as Record<string, unknown>;

  it('should render correctly', () => {
    const picker = new StateFormItem({
      type: 'time_picker',

      // [TODO] Finish implementing this to test.

    }, {} as any);
    const tree = renderer
      .create(<DialogPicker def={picker} hive={hive} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});