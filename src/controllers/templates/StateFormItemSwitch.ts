import type StateForm from '../StateForm';
import StateFormItem from '../StateFormItem';
import type StateFormItemSwitchToggle from '../StateFormItemSwitchToggle';

export interface ISwitchConfig {
  formControlLabelProps?: any;
  formControlProps?: any;
  formGroupProps?: any;
  formLabelProps?: any;
  formHelperTextProps?: any;
}

export default class StateFormItemSwitch extends StateFormItem<
  StateForm,
  StateFormItemSwitchToggle
> {
  private _config?: ISwitchConfig;

  private _getConfig() { return this._config || (this._config = {}); }

  get formControlProps(): any {
    return {
      ...this._getConfig().formControlProps,
      ...this.itemHasState.formControlProps
    };
  }

  get formGroupProps(): any {
    return {
      ...this._getConfig().formGroupProps,
      ...this.itemHasState.formGroupProps
    };
  }

  get formLabelProps(): any {
    return {
      ...this._getConfig().formLabelProps,
      ...this.itemHasState.formLabelProps
    };
  }

  get formControlLabelProps(): any {
    return {
      ...this._getConfig().formControlLabelProps,
      ...this.itemHasState.formControlLabelProps
    };
  }

  get formHelperTextProps(): any {
    return {
      ...this._getConfig().formHelperTextProps,
      ...this.itemHasState.formHelperTextProps
    };
  }

}
