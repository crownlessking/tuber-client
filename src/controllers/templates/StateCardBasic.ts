import IStateCard from '../../interfaces/IStateCard';
import StateCard from '../StateCard';

export default class StateCardBasic extends StateCard {
  get props(): Required<IStateCard>['props'] {
    return {
      sx: {
        minWidth: 275,
      },
      ...this.cardState.props
    };
  }
}