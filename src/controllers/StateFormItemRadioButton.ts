import AbstractState from './AbstractState'
import { IStateFormItemRadioButton } from '../interfaces/IFormChoices'
import IStateFormItemCustom from '../interfaces/IStateFormItemCustom'
import StateFormItemRadioCustom from './templates/StateFormItemRadioCustom'

/**
 * If a set of radio buttons is a *single form item (`StateFormItemRadio`) then
 * this class represents a single radio button in the set.
 */
export default class StateFormItemRadioButton
  extends AbstractState
  implements IStateFormItemRadioButton
{
  private _radioButtonState: IStateFormItemRadioButton
  private _parentDef: StateFormItemRadioCustom
  private _radioButtonHasState: IStateFormItemCustom

  constructor(radioButtonState: IStateFormItemRadioButton, parent: StateFormItemRadioCustom) {
    super()
    this._radioButtonState = radioButtonState
    this._parentDef = parent
    this._radioButtonHasState = radioButtonState.has || {}
  }

  get state(): IStateFormItemRadioButton { return this._radioButtonState }
  get parent(): StateFormItemRadioCustom { return this._parentDef }
  get props(): any { return this._radioButtonState.props }
  get theme(): any { return this.die('Not implemented yet.', {}) }
  get name(): string { return this._radioButtonState.name ?? '' }
  get label(): string {
    return this._radioButtonState.label
      ?? this._radioButtonState.name
      ?? ''
  }
  get color(): Required<IStateFormItemRadioButton>['color'] {
    return this._radioButtonState.color || 'default'
  }
  get disabled(): boolean {
    return this._radioButtonState.disabled === true
  }
  get formControlLabelProps(): any {
    return this._radioButtonHasState.formControlLabelProps
  }
}
