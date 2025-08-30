import renderer from 'react-test-renderer';
import StateForm from 'src/controllers/StateForm';
import IStateFormItem from '../../../../interfaces/IStateFormItem';
import StateJsxDialogAction from '../../../../mui/dialog/actions/state.jsx.form';

describe('src/mui/dialog/actions/state.jsx.form.tsx', () => {
  it('should render correctly', () => {
    const actions = [

      // [TODO] Dialog action is an array of form items

    ] as IStateFormItem[]
    const tree = renderer
      .create(<StateJsxDialogAction
        def={actions}
        parent={{} as StateForm}
      />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  });
});