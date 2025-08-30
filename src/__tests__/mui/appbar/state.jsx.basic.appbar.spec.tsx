import renderer from 'react-test-renderer';
import StatePage from 'src/controllers/StatePage';
import StateJsxBasicAppbar from '../../../mui/appbar/state.jsx.basic.appbar';

describe('src/mui/appbar/state.jsx.basic.appbar.tsx', () => {
  it('should render correctly', () => {
    const page = {
      appbar: { appbarStyle: 'basic' },
    } as StatePage;
    const tree = renderer
      .create(<StateJsxBasicAppbar def={page} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});