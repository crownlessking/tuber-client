import * as React from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import StateDialogCustomized from '../../controllers/templates/StateDialogCustomized'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../state'
import StateJsxDialogAction from './actions/state.jsx'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode
  onClose: () => void
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

interface ICustomizedDialogProps {
  def: StateDialogCustomized
}

export default function StateJsxCustomizedDialog(props: ICustomizedDialogProps) {
  const { def: dialog } = props
  const dispatch = useDispatch<AppDispatch>()
  const open = useSelector((state: RootState) => state.dialog.open ?? false)

  const handleClose = () => {
    dispatch({ type: 'dialog/dialogClose' })
  }

  return (
    <BootstrapDialog
      {...dialog.props}
      onClose={handleClose}
      open={open}
    >
      <BootstrapDialogTitle {...dialog.titleProps} onClose={handleClose}>
        { dialog.title }
      </BootstrapDialogTitle>
      <DialogContent {...dialog.contentProps}>
        { dialog.content }
      </DialogContent>
      <DialogActions {...dialog.actionsProps}>
        <StateJsxDialogAction def={dialog.actions} parent={dialog} />
      </DialogActions>
    </BootstrapDialog>
  )
}
