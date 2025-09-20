import { IStateFormItemRadioButton } from '../../interfaces/IFormChoices';
import StateFormItemCustom from '../StateFormItemCustom';
import type StateFormItemRadio from './StateFormItemRadio';
import StateFormItemRadioButton from '../StateFormItemRadioButton';

/**
 * A custom version of the `StateFormItemCustom` class defined to be used with
 * radio buttons (`StateFormItemRadio`)
 */
export default class StateFormItemRadioCustom extends StateFormItemCustom<
  StateFormItemRadio,
  IStateFormItemRadioButton
> {
  private _radioButtons?: StateFormItemRadioButton[];

  get items(): StateFormItemRadioButton[] {
    return this._radioButtons || (
      this._radioButtons = this.hasItemsState.map(
        button => new StateFormItemRadioButton(button, this)
      )
    );
  }
}
