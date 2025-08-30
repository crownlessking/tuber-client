import { CardMediaProps } from '@mui/material';
import IStateCard from '../../interfaces/IStateCard';
import StateCard from '../StateCard';

export default class StateCardMultiActionArea extends StateCard {
  get props(): Required<IStateCard>['props'] {
    return {
      sx: {
        maxWidth: 345,
      },
      ...this.cardState.props
    };
  }
  get mediaProps(): CardMediaProps {
    return {
      component: 'img',
      sx: {
        width: '100%',
        height: 'auto'
      },
      ...this.cardState.mediaProps
    };
  }

}