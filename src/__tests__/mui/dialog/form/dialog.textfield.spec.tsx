import renderer from 'react-test-renderer';
import DialogTextField from '../../../../mui/dialog/form/dialog.textfield';
import StateFormItem from '../../../../controllers/StateFormItem';
import StateForm from '../../../../controllers/StateForm';

describe('src/mui/dialog/form/dialog.textfield.tsx', () => {

  const hive = {} as Record<string, unknown>;

  it('should render correctly', () => {
    const textfield = new StateFormItem({
      type: 'textfield',

      // [TODO] Finish implementing this to test.

    }, {} as StateForm);
    const tree = renderer
      .create(<DialogTextField def={textfield} hive={hive} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});