import IAbstractState from './IAbstractState';
import { CSSProperties } from 'react';

export default interface IStateComponent extends IAbstractState {
  items?: IStateComponent[];
  theme?: CSSProperties;
}
