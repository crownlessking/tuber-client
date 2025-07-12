import { CSSProperties } from 'react';
import { SxProps } from '@mui/material';
import AbstractState from './AbstractState';
import IStateBackground from '../interfaces/IStateBackground';
import State from './State';

export default class StateBackground<P = State>
  extends AbstractState implements IStateBackground {

  private _backgroundState: IStateBackground;
  private _parentDef: P;

  /**
  * Background
  *
  * @param backgroundState 
  */
  constructor(backgroundState: IStateBackground, parent: P) {
    super();
    this._backgroundState = backgroundState;
    this._parentDef = parent;
  }

  /** Get the background json. */
  get state(): IStateBackground { return this._backgroundState; }
  get parent(): P { return this._parentDef; }
  get props(): any { return this.die('Not implemented yet.', {}); }
  get theme(): any { return this.die('Not implemented yet.', {}); }
  get color(): CSSProperties['backgroundColor'] { return this._backgroundState.color; }
  get image(): CSSProperties['backgroundImage'] { return this._backgroundState.image; }
  get repeat(): CSSProperties['backgroundRepeat'] { return this._backgroundState.repeat; }

  get sx(): SxProps {
    return {
      backgroundColor: this._backgroundState.color,
      backgroundImage: this._backgroundState.image,
      backgroundRepeat: this._backgroundState.repeat
    };
  }
}
