
export default interface IStateAppbarQueries {
  [pageName: string]: {
    value: string;
    mode?: 'search' | 'filter';
  };
}

export interface IStateAppbarQuery {
  value?: string;
  mode?: 'search' | 'filter';
}

export type TStateAppbarQueries = Record<string, IStateAppbarQuery>;