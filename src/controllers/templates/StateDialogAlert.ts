import StateDialog from '../StateDialog';

export default class StateDialogAlert extends StateDialog {

  get props() {
    return {
      'aria-labelledby': 'alert-dialog-title',
      'aria-describedby': 'alert-dialog-description',
      ...this.dialogState.props
    };
  }

  get titleProps() {
    return {
      id: 'alert-dialog-title',
      ...this.dialogState.titleProps
    };
  }

  get contentTextProps() {
    return {
      id: 'alert-dialog-description',
      ...this.dialogState.contentTextProps
    };
  }

}
