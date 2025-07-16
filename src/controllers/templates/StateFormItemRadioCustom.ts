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
  private radioButtons?: StateFormItemRadioButton[];

  get items(): StateFormItemRadioButton[] {
    return this.radioButtons || (
      this.radioButtons = this.hasItemsState.map(
        button => new StateFormItemRadioButton(button, this)
      )
    );
  }
}
