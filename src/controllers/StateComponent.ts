import AbstractState from './AbstractState';
import IStateComponent from '../interfaces/IStateComponent';

export default class StateComponent<P = any>
  extends AbstractState
  implements IStateComponent
{
  private _componentState: IStateComponent;
  private _parentDef: P;
  private _componentItems?: StateComponent[];

  constructor (componentState: IStateComponent, parent: P) {
    super();
    this._componentState = componentState;
    this._parentDef     = parent;
  }

  get state(): IStateComponent { return this._componentState; }
  get parent(): P { return this._parentDef; }
  get type(): string { return this._componentState._type || 'div'; }
  get theme(): any { return this._componentState.theme || {}; }
  get props(): any {
    const props: any = { ...this._componentState }
    delete props.type;
    delete props.theme;
    delete props.items;
    return props;
  }
  get items(): StateComponent<P>[] {
    return this._componentItems = this._componentItems
      || (this._componentItems = (this._componentState.items || []).map(
        (item: IStateComponent) => new StateComponent(item, this)
      ));
  }

  getJson = <T = any>(): T => this._componentState as T;
}

export function getStateComponents<T>(
  sc: IStateComponent[],
  parent: T
): StateComponent<T>[] {
  return sc.map(component => new StateComponent<T>(component, parent));
}
