import { IAbstractState } from '../common.types';


export default interface IStateComponent extends IAbstractState {
  items?: IStateComponent[];
  theme?: any;
}
