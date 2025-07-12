import AbstractState from './AbstractState';
import {
  IStateFormItemAdornment,
  IStateFormItemInputProps
} from '../interfaces/IStateFormItem';
import StateFormItem from './StateFormItem';

export default class StateFormItemInputProps<P=StateFormItem>
  extends AbstractState
  implements IStateFormItemInputProps
{
  private _inputPropsState: IStateFormItemInputProps;
  private _parentDef: P;

  constructor (inputPropsState: IStateFormItemInputProps, parent: P) {
    super();
    this._inputPropsState = inputPropsState;
    this._parentDef = parent;
  }

  get state(): IStateFormItemInputProps { return this._inputPropsState; }
  get start(): IStateFormItemAdornment | undefined { return this._inputPropsState.start; }
  get end(): IStateFormItemAdornment | undefined { return this._inputPropsState.end; }
  get parent(): P { return this._parentDef; }
  get props(): any {
    const { start, end, ...props } = this._inputPropsState;
    return props;
  }
  get theme(): any { return this.die('Not implemented yet.', {}); }
}