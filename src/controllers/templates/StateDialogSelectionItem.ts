import AbstractState from '../AbstractState';
import { type IStateDialogSelectionItem } from '../../interfaces/IStateDialog';
import type StateDialogSelection from './StateDialogSelection';
import { err } from '../../business.logic/logging';
import StateAvatar from '../StateAvatar';
import { blue } from '@mui/material/colors';

export default class StateDialogSelectionItem<T = unknown>
  extends AbstractState
  implements IStateDialogSelectionItem<T>
{
  private avatarState?: StateAvatar;

  constructor(private _itemState: IStateDialogSelectionItem<T>,
    private _parent: StateDialogSelection<T>
  ) {
    super();
  }

  get parent(): StateDialogSelection<T> { return this._parent; }
  get state(): IStateDialogSelectionItem<T> { return this._itemState; }
  get props(): unknown {
    err('`StateDialogSelectionItem.props` not implemented yet.');
    return {};
  }
  get theme(): unknown {
    err('`StateDialogSelectionItem.theme` not implemented yet.');
    return {};
  }
  get title(): string { return this._itemState.title ?? ''; }
  get avatar(): StateAvatar {
    return this.avatarState || (this.avatarState = new StateAvatar(
      this._itemState.avatar || {
        props: {
          sx: { bgcolor: blue[100], color: blue[600] }
        },
        icon: 'person'
      }
    ));
  }
  get icon(): string { return this.avatar.icon || (this.avatar.faIcon ?? ''); }
}
