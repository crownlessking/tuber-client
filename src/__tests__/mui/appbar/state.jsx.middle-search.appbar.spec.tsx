import renderer from 'react-test-renderer';
import StatePage from '../../../controllers/StatePage';
import StateJsxMiddleSearchAppbar from '../../../mui/appbar/state.jsx.middle-search.appbar';

describe('src/mui/appbar/state.jsx.middle-search.appbar.tsx', () => {
  it('should render correctly', () => {
    const page = {
      appbar: { appbarStyle: 'middle_search' },
    } as StatePage;
    const tree = renderer
      .create(<StateJsxMiddleSearchAppbar def={page} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});