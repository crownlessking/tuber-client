import { blue } from '@mui/material/colors';
import AbstractState from '../AbstractState';
import { type IStateDialogSelectionItem } from '../../interfaces/IStateDialog';
import StateAvatar from '../StateAvatar';
import type StateDialogSelection from './StateDialogSelection';
import { err } from '../../business.logic/logging';

export default class StateDialogSelectionItem
  extends AbstractState implements IStateDialogSelectionItem
{
  private itemState: IStateDialogSelectionItem;
  private parentDef: StateDialogSelection;
  private avatarState?: StateAvatar;

  constructor(
    itemState: IStateDialogSelectionItem,
    parent: StateDialogSelection
  ) {
    super();
    this.itemState = itemState;
    this.parentDef = parent;
  }

  get parent(): StateDialogSelection { return this.parentDef; }
  get state(): IStateDialogSelectionItem { return this.itemState; }
  get props(): any {
    err('`StateDialogSelectionItem.props` not implemented yet.');
    return {};
  }
  get theme(): any {
    err('`StateDialogSelectionItem.theme` not implemented yet.');
    return {};
  }
  get title(): string { return this.itemState.title ?? ''; }
  get avatar(): StateAvatar {
    return this.avatarState || (this.avatarState = new StateAvatar(
      this.itemState.avatar || {
        props: {
          sx: { bgcolor: blue[100], color: blue[600] }
        },
        icon: 'person'
      }
    ));
  }
  get icon(): string { return this.avatar.icon || (this.avatar.faIcon ?? ''); }
}
