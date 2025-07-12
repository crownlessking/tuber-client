import AbstractState from './AbstractState';
import IFormChoices from '../interfaces/IFormChoices';
import StateFormItemCheckboxCustom from './templates/StateFormItemCheckboxCustom';
import StateFormItemCustom from './StateFormItemCustom';
import { IAbstractState } from '../common.types';

export interface IStateFormItemCheckboxBox extends IAbstractState, IFormChoices { }

export default class StateFormItemCheckboxBox
  extends AbstractState implements IStateFormItemCheckboxBox
{
  private _checkboxState: IStateFormItemCheckboxBox;
  private _parentDef: StateFormItemCheckboxCustom;
  private _checkboxHas?: StateFormItemCustom<this>;

  constructor(checkboxState: IStateFormItemCheckboxBox, parent: StateFormItemCheckboxCustom) {
    super()
    this._checkboxState = checkboxState;
    this._parentDef = parent;
  }

  get state(): IStateFormItemCheckboxBox { return this._checkboxState; }
  get parent(): StateFormItemCheckboxCustom { return this._parentDef; }
  get name(): string { return this._checkboxState.name ?? ''; }
  get label(): string { return this._checkboxState.label ?? ''; }
  get color(): Required<IStateFormItemCheckboxBox>['color'] {
    return this._checkboxState.color || 'default';
  }
  get disabled(): boolean|undefined { return this._checkboxState.disabled; }
  get props(): any { return this._checkboxState.props; }
  get theme(): any { return this.die('Not implemented yet.', {}); }
  get has(): StateFormItemCustom<this> {
    return this._checkboxHas || (
      this._checkboxHas = new StateFormItemCustom(
        this._checkboxState.has || {},
        this
      )
    );
  }
  get hasLabel(): boolean { return !!this._checkboxState.label; }
  get formControlLabelProps(): any { return this.has.formControlLabelProps; }
}
