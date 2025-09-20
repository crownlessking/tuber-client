import AbstractState from './AbstractState';
import StateLink from './StateLink';
import type State from './State';
import IStateDrawer from '../interfaces/IStateDrawer';
import { DrawerProps } from '@mui/material';
import { TWithRequired } from '../common.types';
import { CSSProperties } from 'react';

export default class StateDrawer<P = State>
  extends AbstractState
  implements IStateDrawer
{
  /** Default drawer width */
  static DEFAULT_WIDTH: number = 300;
  protected drawerItems?: StateLink<StateDrawer<P>>[];

  constructor (protected drawerState: IStateDrawer, protected parentDef: P) {
    super();
  }

  get state(): IStateDrawer { return this.drawerState; }
  get parent(): P { return this.parentDef; }
  get props(): TWithRequired<DrawerProps, 'anchor'> {
    return {
      ...this.drawerState.props,
      anchor: this.drawerState.anchor ?? 'left'
    };
  }
  get theme(): CSSProperties { return this.die('Not implemented.', {}); }
  get _type() { return this.drawerState._type || 'none'; }
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
