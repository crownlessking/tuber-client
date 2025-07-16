import IStateCard from '../../interfaces/IStateCard';
import StateCard from '../StateCard';

export default class StateCardComplex extends StateCard {
  get props(): Required<IStateCard>['props'] {
    return {
      sx: {
        maxWidth: 345,
      },
      ...this.cardState.props
    };
  }
  get headerProps(): Required<IStateCard>['headerProps'] {
    return {
      title: 'Shrimp and Chorizo Paella',
      subheader: 'September 14, 2016',
      ...this.cardState.headerProps
    };
  }
  get avatarProps(): any {
    return {
      alt: 'Avatar',
      ...this.cardState.avatarProps
    };
  }
  get fullText(): string { return this.cardState.fullText ?? ''; }
}
