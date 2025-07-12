import AbstractState from './AbstractState';
import StateLink from './StateLink';
import State from './State';
import IStateDrawer from '../interfaces/IStateDrawer';

export default class StateDrawer<P = State>
  extends AbstractState
  implements IStateDrawer
{
  /** Default drawer width */
  static DEFAULT_WIDTH: number = 300;

  protected drawerState: IStateDrawer;
  protected parentDef: P;
  protected drawerItems?: StateLink<StateDrawer<P>>[];

  constructor (drawerState: IStateDrawer, parent: P) {
    super();
    this.drawerState = drawerState;
    this.parentDef = parent;
  }

  get state(): IStateDrawer { return this.drawerState; }
  get parent(): P { return this.parentDef; }
  get props() {
    return {
      ...this.drawerState.props,
      anchor: this.drawerState.anchor
    };
  }
  get theme(): any {
    return this.die('Not implemented yet.', {});
  }
  get _type() {
    return this.drawerState._type || 'none';
  }
  /** Get the drawer's list of icon links. */
  get items(): StateLink[] {
    return this.drawerItems
      || (this.drawerItems = (this.drawerState.items || []).map(
        item => new StateLink<this>(item, this)
      ));
  }
  /** Whether the drawer is open or not. */
  get open(): boolean { return this.drawerState.open === true; }
  /** Drawer's width */
  get width(): number { return this.drawerState.width || StateDrawer.DEFAULT_WIDTH; }
}
