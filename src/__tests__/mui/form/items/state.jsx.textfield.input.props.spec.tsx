import TextField from '@mui/material/TextField';
import renderer from 'react-test-renderer';
import StateForm from 'src/controllers/StateForm';
import StateFormItem from 'src/controllers/StateFormItem';
import StateFormItemInputProps from 'src/controllers/StateFormItemInputProps';
import { IStateFormItemAdornment } from 'src/interfaces/IStateFormItem';
import StateJsxTextfieldInputProps from '../../../../mui/form/items/state.jsx.textfield.input.props';

describe('src/mui/form/items/state.jsx.textfield.input.props.tsx', () => {

  describe('StateJsxTextfieldInputProps', () => {

    it('should render', () => {
      const adornment = new StateFormItemInputProps({
        'startAdornment': {
          icon: {
            type: 'icon',
            has: {
              icon: 'account_circle',
            }
          },
          textProps: {
            color: 'primary',
          },
        } as IStateFormItemAdornment,
        'endAdornment': {
          icon: {
            type: 'icon',
            has: {
              icon: 'account_circle',
            }
          },
          textProps: {
            color: 'primary',
          },
        } as IStateFormItemAdornment,
      }, {} as StateFormItem<StateForm>);
      const component = renderer.create(
        <TextField
          InputProps={StateJsxTextfieldInputProps(adornment)}
        />
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

  });

});