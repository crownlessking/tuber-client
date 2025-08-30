import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../state';
import type StateDialogAlert from '../../controllers/templates/StateDialogAlert';
import StateJsxDialogAction from './actions/state.jsx';
import parse from 'html-react-parser';

interface IAlertDialogProps {
  def: StateDialogAlert;
}

export default function StateJsxAlertDialog(props: IAlertDialogProps) {
  const { def: dialog } = props;
  const dispatch = useDispatch<AppDispatch>();
  const open = useSelector((state: RootState) => state.dialog.open ?? false);
  const handleClose = () => dispatch({ type: 'dialog/dialogClose' });

  return (
    <Dialog
      {...dialog.props}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle {...dialog.titleProps}>
        { dialog.title }
      </DialogTitle>
      <DialogContent {...dialog.contentProps}>
        {dialog.contentText ? (
          <DialogContentText {...dialog.contentTextProps}>
            { dialog.contentText }
          </DialogContentText>
        ) : ( null )}
        {/* <div dangerouslySetInnerHTML={{ __html: dialog.content }} /> */}
        { parse(dialog.content as string) }
      </DialogContent>
      <DialogActions {...dialog.actionsProps}>
        <StateJsxDialogAction def={dialog.actions} parent={dialog} />
      </DialogActions>
    </Dialog>
  );
}
