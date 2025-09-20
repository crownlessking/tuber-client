import AbstractState from './AbstractState';
import IStateFormItemSwitchToggle from '../interfaces/IStateFormItemSwitchToggle';
import type StateFormItemSwitch from './templates/StateFormItemSwitch';
import React, { CSSProperties } from 'react';
import { FormControlLabelProps } from '@mui/material';

export default class StateFormItemSwitchToggle
  extends AbstractState
  implements IStateFormItemSwitchToggle
{
  constructor (private _switchToggleState: IStateFormItemSwitchToggle,
    private _parent: StateFormItemSwitch
  ) {
    super();
  }

  get state(): IStateFormItemSwitchToggle { return this._switchToggleState; }
  get parent(): StateFormItemSwitch { return this._parent; }
  get props(): Record<string, unknown> { return this._switchToggleState.props ?? {}; }
  get theme(): CSSProperties { return this._switchToggleState.theme ?? {}; }

  get label(): string { return this._switchToggleState.label ?? ''; }
  get name(): string { return this._switchToggleState.name ?? ''; }

  get formControlLabelProps(): FormControlLabelProps {
    return this._switchToggleState.formControlLabelProps ?? {
      'control': React.createElement('input', { type: 'checkbox' }),
      'label': this.label
    };
  }
}