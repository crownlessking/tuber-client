import { useSelector } from 'react-redux';
import type { RootState } from '../../state';
import {
  StateDialog,
  StateDialogAlert,
  StateDialogCustomized,
  StateDialogForm,
  StateDialogSelection
} from '../../controllers';
import StateJsxAlertDialog from './state.jsx.alert.dialog';
import StateJsxCustomizedDialog from './state.jsx.customized.dialog';
import StateJsxFormDialog from './state.jsx.form.dialog';
import StateJsxSelectionDialog from './state.jsx.selection.dialog';

export default function StateJsxDialog () {
  const dialogState = useSelector((state: RootState) => state.dialog);

  // Create the dialog controller instance
  const dialog = new StateDialog(dialogState);

  // Get the dialog type
  const type = dialog._type.toLowerCase();
  
  // Select and return the appropriate dialog component
  switch (type) {
    case 'selection':
      return (
        <StateJsxSelectionDialog
          def={new StateDialogSelection(dialog.state)}
        />
      );
    case 'alert':
      return <StateJsxAlertDialog def={new StateDialogAlert(dialog.state)} />;
    case 'form':
      return <StateJsxFormDialog def={new StateDialogForm(dialog.state)} />;
    case 'any':
      return (
        <StateJsxCustomizedDialog
          def={new StateDialogCustomized(dialog.state)}
        />
      );
    default:
      return null;
  }
}
