import AbstractState from './AbstractState';
import IStateComponent from '../interfaces/IStateComponent';
import { CSSProperties } from 'react';

export default class StateComponent<P = unknown>
  extends AbstractState
  implements IStateComponent
{
  private _componentState: IStateComponent;
  private _parentDef: P;
  private _componentItems?: StateComponent<P>[];

  constructor (componentState: IStateComponent, parent: P) {
    super();
    this._componentState = componentState;
    this._parentDef     = parent;
  }

  get state(): IStateComponent { return this._componentState; }
  get parent(): P { return this._parentDef; }
  get type(): string { return this._componentState._type || 'div'; }
  get theme(): CSSProperties { return this._componentState.theme || {}; }
  get props(): Record<string, unknown> {
    const props: Record<string, unknown> = { ...this._componentState }
    delete props.type;
    delete props.theme;
    delete props.items;
    return props;
  }
  get items(): StateComponent[] {
    return this._componentItems = this._componentItems
      || (this._componentItems = (this._componentState.items || []).map(
        (item: IStateComponent) => new StateComponent<P>(item, this._parentDef)
      ));
  }

  getJson = <T = unknown>(): T => this._componentState as T;
}

export function getStateComponents<T>(
  sc: IStateComponent[],
  parent: T
): StateComponent<T>[] {
  return sc.map(component => new StateComponent<T>(component, parent));
}
