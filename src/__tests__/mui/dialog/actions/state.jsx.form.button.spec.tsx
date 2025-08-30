import renderer from 'react-test-renderer';
import StateForm from 'src/controllers/StateForm';
import StateFormItem from '../../../../controllers/StateFormItem';
import StateJsxDialogAction from '../../../../mui/dialog/actions/state.jsx.form.button';

describe('src/mui/dialog/actions/state.jsx.form.button.tsx', () => {
  it('should render correctly', () => {
    const button1 = new StateFormItem({
      type: 'state_button',
      id: 'button',
      label: 'Button',
    }, {} as StateForm)
    const tree = renderer
      .create(<StateJsxDialogAction def={button1} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});