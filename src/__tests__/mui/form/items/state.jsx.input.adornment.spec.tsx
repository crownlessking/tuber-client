import renderer from 'react-test-renderer';
import getTextFieldAdornment from 'src/mui/form/items/state.jsx.input.adornment';
import Textfield from '@mui/material/TextField';
import StateFormItem from '../../../../controllers/StateFormItem';
import StateForm from '../../../../controllers/StateForm';

describe('src/mui/form/items/state.jsx.textfield.tsx', () => {

  describe('Textfield', () => {

    it('should render', () => {
      const textfield = new StateFormItem({
        name: 'textfield',
        type: 'textfield',
        label: 'Textfield',
  
        // [TODO]: Add properties here to test rendering
  
      }, {} as StateForm);
      const component = renderer.create(
        <Textfield
          inputProps={getTextFieldAdornment(textfield.inputProps)} 
        />
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

  });

});