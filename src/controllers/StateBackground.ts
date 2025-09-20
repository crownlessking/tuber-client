import { type CSSProperties } from 'react';
import { type SxProps } from '@mui/material';
import AbstractState from './AbstractState';
import IStateBackground from '../interfaces/IStateBackground';
import type State from './State';

export default class StateBackground<P = State>
  extends AbstractState
  implements IStateBackground
{
  constructor(private _backgroundState: IStateBackground, private _parent: P) {
    super();
  }

  /** Get the background json. */
  get state(): IStateBackground { return this._backgroundState; }
  get parent(): P { return this._parent; }
  get props(): unknown { return this.die('Not implemented yet.', {}); }
  get theme(): unknown { return this.die('Not implemented yet.', {}); }
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
