import AbstractState from './AbstractState';
import IStateFormItemSwitchToggle from '../interfaces/IStateFormItemSwitchToggle';
import StateFormItemSwitch from './templates/StateFormItemSwitch';

export default class StateFormItemSwitchToggle
  extends AbstractState
  implements IStateFormItemSwitchToggle
{

  private _switchToggleState: IStateFormItemSwitchToggle;
  private _parentDef: StateFormItemSwitch;

  constructor (
    switchToggleState: IStateFormItemSwitchToggle,
    parent: StateFormItemSwitch) 
  {
    super();
    this._switchToggleState = switchToggleState;
    this._parentDef = parent;
  }

  get state(): IStateFormItemSwitchToggle { return this._switchToggleState; }
  get parent(): StateFormItemSwitch { return this._parentDef; }
  get props(): any { return this._switchToggleState.props; }
  get theme(): any { return this._switchToggleState.theme; }

  get label(): string { return this._switchToggleState.label ?? ''; }
  get name(): string { return this._switchToggleState.name ?? ''; }

  get formControlLabelProps(): any {
    return this._switchToggleState.formControlLabelProps;
  }
}