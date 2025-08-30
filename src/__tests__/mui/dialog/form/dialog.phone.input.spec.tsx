import renderer from 'react-test-renderer';
import DialogPhoneInput from '../../../../mui/dialog/form/dialog.phone.input';
import StateFormItemInput from '../../../../controllers/templates/StateFormItemInput';
import StateForm from 'src/controllers/StateForm';

describe('src/mui/dialog/form/dialog.phone.input.tsx', () => {

  const hive = {} as Record<string, unknown>;

  it('should render correctly', () => {
    const input = new StateFormItemInput({
      type: 'state_input',

      // [TODO] Finish implementing this to test.

    }, {} as StateForm);
    const tree = renderer
      .create(<DialogPhoneInput def={input} hive={hive} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});