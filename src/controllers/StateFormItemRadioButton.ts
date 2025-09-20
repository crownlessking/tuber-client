import AbstractState from './AbstractState';
import { IStateFormItemRadioButton } from '../interfaces/IFormChoices';
import IStateFormItemCustom from '../interfaces/IStateFormItemCustom';
import type StateFormItemRadioCustom from './templates/StateFormItemRadioCustom';
import { CSSProperties } from 'react';
import { FormControlLabelProps, Radio } from '@mui/material';
import React from 'react';

/**
 * If a set of radio buttons is a *single form item (`StateFormItemRadio`) then
 * this class represents a single radio button in the set.
 */
export default class StateFormItemRadioButton
  extends AbstractState
  implements IStateFormItemRadioButton
{
  private _radioButtonHasState: IStateFormItemCustom;

  constructor(private _radioButtonState: IStateFormItemRadioButton,
    private _parent: StateFormItemRadioCustom
  ) {
    super();
    this._radioButtonHasState = this._radioButtonState.has || {};
  }

  get state(): IStateFormItemRadioButton { return this._radioButtonState; }
  get parent(): StateFormItemRadioCustom { return this._parent; }
  get props(): Record<string, unknown> { return this._radioButtonState.props ?? {}; }
  get theme(): CSSProperties { return this.die('Not implemented yet.', {}); }
  get name(): string { return this._radioButtonState.name ?? ''; }
  get label(): string {
    return this._radioButtonState.label
      ?? this._radioButtonState.name
      ?? '';
  }
  get color(): Required<IStateFormItemRadioButton>['color'] {
    return this._radioButtonState.color || 'default';
  }
  get disabled(): boolean {
    return this._radioButtonState.disabled === true;
  }
  get formControlLabelProps(): FormControlLabelProps {
    return this._radioButtonHasState.formControlLabelProps ?? {
      'control': React.createElement(Radio, {
        color: this.color,
        disabled: this.disabled,
        ...this.props
      }),
      'label': this.label
    };
  }
}
