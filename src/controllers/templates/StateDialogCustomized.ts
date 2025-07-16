import IStateFormItem from '../../interfaces/IStateFormItem';
import StateDialog from '../StateDialog';

export default class StateDialogCustomized extends StateDialog {

  get props() {
    return {
      'aria-labelledby': 'customized-dialog-title',
      ...this.dialogState.props
    };
  }

  get titleProps() {
    return {
      id: 'customized-dialog-title',
      ...this.dialogState.titleProps
    };
  }

  get contentProps() {
    return {
      dividers: true,
      ...this.dialogState.contentProps
    };
  }

  get actions(): IStateFormItem[] {
    return this.dialogState.actions || [];
  }

}
