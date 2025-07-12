import { remember_exception } from '../business.logic/errors';
import AbstractState from './AbstractState';
import { IJsonapiPaginationLinks } from '../interfaces/IJsonapi';

type TLink = IJsonapiPaginationLinks[keyof IJsonapiPaginationLinks];

export default class JsonapiPaginationLinks extends AbstractState {
  private _selfPageNumber?: number;
  private _pageSize?: number;
  private _firstPageNumber?: number;
  private _lastPageNumber?: number;
  private _nextPageNumber?: number;
  private _prevPageNumber?: number;

  constructor (private _links: IJsonapiPaginationLinks) {
    super();
    if (!this._links) {
      this._lastPageNumber = 1; // [bugfix]
    }
  }

  get parent (): any { return this.die('Not implemented yet.', {}); }
  get state (): any { return this.die('Not implemented yet.', {}); }
  get props (): any { return this.die('Not implemented yet.', {}); }
  get theme (): any { return this.die('Not implemented yet.', {}); }

  /**
   * Get the query string value by key.
   * @param url
   * @param key
   * @returns value of the query string key
   */
  private _get_query_val = (url: string, key: string): string => {
    const query = url.split('?')[1];
    if (!query) return '';
    const pairs = query.split('&');
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const [k, v] = pair.split('=');
      if (k === key) return v;
    }
    return '';
  };

  get pageSize(): number {
    try {
      return this._pageSize || (
        this._pageSize = Number(this._get_query_val(
          get_jsonapi_link_url(this._links.self),
          'page[size]'
        ))
      );
    } catch (err: any) {
      remember_exception(err, 'JsonapiPaginationLinks.get: pageSize defaulted to 25.');
      return this._pageSize = 25;
    }
  }

  /** Current page number */
  get selfPageNumber(): number {
    try {
      return this._selfPageNumber || (
        this._selfPageNumber = Number(this._get_query_val(
          get_jsonapi_link_url(this._links.self),
          'page[number]'
        ))
      );
    } catch (err: any) {
      remember_exception(err, 'JsonapiPaginationLinks.get: selfPageNumber defaulted to 1.');
      return this._selfPageNumber = 1;
    }
  }

  get firstPageNumber(): number {
    try {
      return this._firstPageNumber || (
        this._firstPageNumber = Number(this._get_query_val(
          get_jsonapi_link_url(this._links.first),
          'page[number]'
        ))
      );
    } catch (err) {
      remember_exception(err, 'JsonapiPaginationLinks.get: firstPageNumber defaulted to 1.');
      return this._firstPageNumber = 1;
    }
  }

  get lastPageNumber(): number {
    try {
      return this._lastPageNumber || (
        this._lastPageNumber = Number(this._get_query_val(
          get_jsonapi_link_url(this._links.last),
          'page[number]'
        ))
      );
    } catch (err) {
      remember_exception(err, 'JsonapiPaginationLinks.get: lastPageNumber defaulted to 1.');
      return this._lastPageNumber = 1;
    }
  }

  get nextPageNumber(): number {
    try {
      return this._nextPageNumber || (
        this._nextPageNumber = Number(this._get_query_val(
          get_jsonapi_link_url(this._links.next),
          'page[number]'
        ))
      );
    } catch (err) {
      remember_exception(err, 'JsonapiPaginationLinks.get: nextPageNumber defaulted to 1.');
      return this._nextPageNumber = 1;
    }
  }

  get prevPageNumber(): number {
    try {
      return this._prevPageNumber || (
        this._prevPageNumber = Number(this._get_query_val(
          get_jsonapi_link_url(this._links.prev),
          'page[number]'
        ))
      );
    } catch (err) {
      remember_exception(err, 'JsonapiPaginationLinks.get: prevPageNumber defaulted to 1.');
      return this._prevPageNumber = 1;
    }
  }

  /** Get a link url with updated an query string. */
  getLinkUrl({
    pageNumber,
    pageSize,
    // TODO Add more query params to update
  }: {pageNumber?: number, pageSize?: number}) {
    let qs = get_jsonapi_link_url(this._links.self);
    const params = new URLSearchParams(qs);
    if (pageNumber) {
      params.set('page[number]', pageNumber.toString());
    }
    if (pageSize) {
      params.set('page[size]', pageSize.toString());
    }
    const updatedQs = params.toString();
    return updatedQs;
  }
}

/** Returns the url, including the query parameters as a string. */
export function get_jsonapi_link_url (link: TLink): string {
  switch (typeof link) {
    case 'string':
      return link;
    case 'object':
      return link.href;
    default:
      return '';
  }
}