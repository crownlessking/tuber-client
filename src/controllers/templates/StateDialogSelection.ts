import IStateDialog, { IStateDialogSelectionItem } from '../../interfaces/IStateDialog';
import type State from '../State';
import StateDialog from '../StateDialog';
import StateDialogSelectionItem from './StateDialogSelectionItem';

export default class StateDialogSelection
  extends StateDialog implements IStateDialog
{
  private dialogSelectionState: IStateDialog;
  private dialogItems?: StateDialogSelectionItem[];

  constructor(dialogSelectionState: IStateDialog, parent?: State) {
    super(dialogSelectionState, parent);
    this.dialogSelectionState = dialogSelectionState;
  }

  get list() {
    return this.dialogItems || (
      this.dialogItems = (this.dialogSelectionState.list || []).map(
        item => new StateDialogSelectionItem(item, this)
      )
    );
  }

  get callback(): (item: IStateDialogSelectionItem) => void {
    return this.dialogSelectionState.callback || (() => {});
  }
}
