import AbstractState from './AbstractState';
import IStateFormItemGroup, { TItemGroup } from '../interfaces/IStateFormItemGroup';
import type StateForm from './StateForm';
import StateFormItem from './StateFormItem';
import { CSSProperties } from 'react';

export default class StateFormItemGroup
  extends AbstractState implements IStateFormItemGroup
{
  private _itemGroupItems?: StateFormItem[];

  constructor (private _itemGroupState: IStateFormItemGroup,
    protected parentDef: StateForm
  ) {
    super();
  }

  get state(): IStateFormItemGroup { return this._itemGroupState; }
  get parent(): StateForm { return this.parentDef; }
  get props(): Record<string, unknown> { return this._itemGroupState.props ?? {}; }
  get theme(): CSSProperties { return this._itemGroupState.theme ?? {}; }

  get type(): TItemGroup {
    return this._itemGroupState.type || 'none';
  }

  get items(): StateFormItem[] {
    return this._itemGroupItems
      || (this._itemGroupItems = (this._itemGroupState.items || []).map(
          item => new StateFormItem(item, this.parentDef
        )));
  }

  getProps<T=Record<string, unknown>>($default?: T) {
    return {
      ...this.props,
      ...$default
    } as T;
  }
}
