import AbstractState from './AbstractState';
import IStateFormItemGroup, { TItemGroup } from '../interfaces/IStateFormItemGroup';
import StateForm from './StateForm';
import StateFormItem from './StateFormItem';

export default class StateFormItemGroup
  extends AbstractState implements IStateFormItemGroup
{
  protected parentDef: StateForm;
  private _itemGroupState: IStateFormItemGroup;
  private _itemGroupItems?: StateFormItem[];

  constructor (itemGroupState: IStateFormItemGroup, parent: StateForm) {
    super();
    this._itemGroupState = itemGroupState;
    this.parentDef = parent;
  }

  get state(): IStateFormItemGroup { return this._itemGroupState; }
  get parent(): StateForm { return this.parentDef; }
  get props(): any { return this._itemGroupState.props; }
  get theme(): any { return this._itemGroupState.theme; }

  get type(): TItemGroup {
    return this._itemGroupState.type || 'none';
  }

  get items(): StateFormItem[] {
    return this._itemGroupItems
      || (this._itemGroupItems = (this._itemGroupState.items || []).map(
          item => new StateFormItem(item, this.parentDef
        )));
  }
}
