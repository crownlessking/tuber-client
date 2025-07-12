import { IJsonapiPaginationLinks } from './IJsonapi';

export default interface IStateTopLevelLinks {
  [endpoint: string]: IJsonapiPaginationLinks;
}
