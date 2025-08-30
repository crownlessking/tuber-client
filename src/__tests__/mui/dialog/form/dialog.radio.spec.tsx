import renderer from 'react-test-renderer';
import DialogRadio from '../../../../mui/dialog/form/dialog.radio';
import StateFormItemRadio from '../../../../controllers/templates/StateFormItemRadio';
import StateForm from 'src/controllers/StateForm';

describe('src/mui/dialog/form/dialog.radio.tsx', () => {

  const hive = {} as Record<string, unknown>;

  it('should render correctly', () => {
    const radio = new StateFormItemRadio({
      type: 'radio_buttons',

      // [TODO] Finish implementing this to test.

    }, {} as StateForm);
    const tree = renderer
      .create(<DialogRadio def={radio} hive={hive} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});