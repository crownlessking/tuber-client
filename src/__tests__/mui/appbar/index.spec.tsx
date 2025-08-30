import renderer from 'react-test-renderer';
import StatePage from 'src/controllers/StatePage';
import StateJsxAppbar from '../../../mui/appbar';

describe('src/mui/appbar/index.tsx', () => {
  it('should render correctly', () => {
    const page = {
      appbar: { appbarStyle: 'basic' },
    } as StatePage;
    const tree = renderer
      .create(<StateJsxAppbar def={page} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});