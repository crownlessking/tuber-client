import AbstractState from './AbstractState';
import {
  IStateFormItemAdornment,
  IStateFormItemInputProps
} from '../interfaces/IStateFormItem';
import type StateFormItem from './StateFormItem';

export default class StateFormItemInputProps<P=StateFormItem>
  extends AbstractState
  implements IStateFormItemInputProps
{
  constructor (private _inputPropsState: IStateFormItemInputProps,
    private _parentDef: P
  ) {
    super();
  }

  get state(): IStateFormItemInputProps { return this._inputPropsState; }
  get start(): IStateFormItemAdornment | undefined { return this._inputPropsState.start; }
  get end(): IStateFormItemAdornment | undefined { return this._inputPropsState.end; }
  get parent(): P { return this._parentDef; }
  get props(): Record<string, unknown> {
    const { start, end, ...props } = this._inputPropsState;
    return props;
  }
  get theme(): unknown { return this.die('Not implemented yet.', {}); }
}