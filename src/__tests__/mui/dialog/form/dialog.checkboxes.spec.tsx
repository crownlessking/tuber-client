import renderer from 'react-test-renderer';
import DialogCheckboxes from '../../../../mui/dialog/form/dialog.checkboxes';
import StateFormItem from '../../../../controllers/StateFormItem';
import type StateForm from '../../../../controllers/StateForm';
import StateFormItemCheckboxBox from '../../../../controllers/StateFormItemCheckboxBox';

describe('src/mui/dialog/form/dialog.checkboxes.tsx', () => {

  const hive = {} as Record<string, unknown>;

  it('should render correctly', () => {
    const checkboxes = new StateFormItem<StateForm, StateFormItemCheckboxBox>({
      type: 'checkboxes',

      // [TODO] Finish implementing this to test.

    }, {} as StateForm);
    const tree = renderer
      .create(<DialogCheckboxes def={checkboxes} hive={hive} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});