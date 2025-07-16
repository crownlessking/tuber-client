import type StateCard from '../StateCard';
import StateFormItem from '../StateFormItem';

export default class StateFormItemCardAction extends StateFormItem<StateCard> {
  get props(): Required<StateFormItem<StateCard>>['props'] {
    return {
      size: 'small',
      ...this.itemState.props
    };
  }
}
