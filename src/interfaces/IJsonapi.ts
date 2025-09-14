import { INetState } from './IState';

export interface IResponseRequirement {
  driver?: string;
  state?: INetState;
}

export type TJsonapiErrorCode = 'EXCEPTION'
| 'BAD_VALUE'
| 'MISSING_VALUE'
| 'MISSING_STATE'
| 'VALIDATION_ERROR'
| 'MISSING_REQUIRED_FIELD'
| 'INVALID_FORMAT'
| 'DUPLICATE_RESOURCE'
| 'AUTHENTICATION_REQUIRED'
| 'INSUFFICIENT_PERMISSIONS'
| 'TOKEN_EXPIRED'
| 'RESOURCE_NOT_FOUND'
| 'OPERATION_NOT_ALLOWED'
| 'RESOURCE_LOCKED'
| 'INTERNAL_ERROR'
| 'SERVICE_UNAVAILABLE'
| 'RATE_LIMITED'
| 'NOT_IMPLEMENTED'
| 'NO_RESPONSE';

export type TJsonapiErrorStatus = '100' | '101' | '102'
| '200' | '201' | '202' | '203' | '204' | '205' | '206' | '207' | '208' | '226'
| '300' | '301' | '302' | '303' | '304' | '305' | '306' | '307' | '308'
| '400' | '401' | '402' | '403' | '404' | '405' | '406' | '407' | '408' | '409'
| '410' | '411' | '412' | '413' | '414' | '415' | '416' | '417' | '418' | '420'
| '422' | '423' | '424' | '425' | '426' | '428' | '429' | '431' | '444' | '449'
| '450' | '451' | '499'
| '500' | '501' | '502' | '503' | '504' | '505' | '506' | '507' | '508' | '509'
| '510' | '511' | '598' | '599';

/* ----------------------------------------------------------------------------
JSONAPI SPECIFICATION
---------------------------------------------------------------------------- */

/**
 * Type for the server response's `jsonapi` member.  
 * An object describing the server’s implementation.
 *
 * _Example Json document_:
 * ```json
 * {
 *    "jsonapi": {} // <-- Type for that member
 * }
 * ```
 * @see https://jsonapi.org/format/#document-jsonapi-object
 */
export interface IJsonapiMember {
  version?: '1.0' | '1.1';
  ext?: string[]; // Extension names
  profile?: string[]; // Profile names
  [key: string]: string | string[] | undefined;
}

/**
 * Type for the server response's `meta` member.
 *
 * _Example Json document_:
 * ```json
 * {
 *    "jsonapi": {},
 *    "meta": {} // <-- type for that member
 * }
 * ```
 * @see https://jsonapi.org/format/#document-meta
 */
export type TJsonapiMeta = Record<string, unknown>;

/**
 * @see https://jsonapi.org/format/#document-links
 */
export interface IJsonapiLinkObject {
  href: string;
  meta?: TJsonapiMeta;
}

export type TJsonapiLink = IJsonapiLinkObject | string | undefined;

export interface IJsonapiErrorLinks {
  about?: IJsonapiLinkObject;
  [prop: string]: TJsonapiLink;
}

export interface IJsonapiErrorSource {
  pointer?: string;
  parameter?: string;
}

/**
 * Type for the server response's `errors` member array elements.
 *
 * _Example Json document_:
 * ```json
 * {
 *    "jsonapi": {},
 *    "meta": {},
 *    "errors": [] // <-- type for elements
 * }
 * ```
 * @see https://jsonapi.org/format/#errors
 */
export interface IJsonapiError {
  id?: string;
  links?: IJsonapiErrorLinks;
  status?: TJsonapiErrorStatus;
  code: TJsonapiErrorCode;
  title: string;
  detail?: string;
  source?: IJsonapiErrorSource;
  meta?: TJsonapiMeta;
}

interface IJsonapiAbstractLinks {
  self?: IJsonapiLinkObject | string;
  related?: IJsonapiLinkObject | string;
}

export interface IJsonapiPageLinks extends IJsonapiAbstractLinks {
  [key: string]: TJsonapiLink;
}

export interface IJsonapiSpecLinks extends IJsonapiAbstractLinks {
  self: IJsonapiLinkObject | string;
}

/**
 * @see https://jsonapi.org/format/#fetching-pagination
 */
export interface IJsonapiPaginationLinks extends IJsonapiSpecLinks {
  first?: IJsonapiLinkObject | string;
  last?: IJsonapiLinkObject | string;
  prev?: IJsonapiLinkObject | string;
  next?: IJsonapiLinkObject | string;
  [key: string]: TJsonapiLink;
}

export interface IJsonapiResourceLinks extends IJsonapiSpecLinks {
  [key: string]: TJsonapiLink;
}

/**
 * @see https://jsonapi.org/format/#document-compound-documents
 */
export interface IJsonapiCompoundDoc {
  type: string;
  id?: string;
}

/**
 * @see https://jsonapi.org/format/#document-resource-object-linkage
 */
export interface IJsonapiResourceLinkage extends IJsonapiCompoundDoc {
  id: string;
}

export interface IJsonapiResourceAbstract {
  meta?: TJsonapiMeta;
  links?: IJsonapiResourceLinks;
}

export type TJsonapiDataLinkage = IJsonapiResourceLinkage | IJsonapiResourceLinkage[] | null;
export type TJsonapiDataCollection = IJsonapiResourceLinkage[];

/**
 * @see https://jsonapi.org/format/#document-resource-object-relationships
 */
export interface IJsonapiRelationship extends IJsonapiResourceAbstract {
  data: TJsonapiDataLinkage;
}
export interface IJsonapiDataRelationships {
  [key: string]: IJsonapiRelationship;
}

/**
 * @see https://jsonapi.org/format/#document-resource-objects
 */
export interface IJsonapiDataAttributes {
  [member: string]: unknown;
}

export interface IJsonapiResource<T=IJsonapiDataAttributes> 
  extends IJsonapiCompoundDoc, IJsonapiResourceAbstract
{
  attributes?: T;
  relationships?: IJsonapiDataRelationships;
}

export interface IJsonapiPageParams {
  number?: number;
  size?: number;
  [key: string]: number | undefined;
}

export interface IJsonapiFilterParams {
  search?: string;
  [key: string]: string | undefined;
}

export interface IJsonapiQueryParams {
  fields?: Record<string, string>;
  include?: string;
  sort?: string;
  page?: IJsonapiPageParams;
  filter?: IJsonapiFilterParams;
}

// RESPONSE SPECIFICATION //

export interface IJsonapiResponseResource<T=IJsonapiDataAttributes>
  extends IJsonapiResourceLinkage, IJsonapiResourceAbstract
{
  attributes: T;
  relationships?: IJsonapiDataRelationships;
}

export interface IJsonapiAbstractResponse extends IResponseRequirement {
  jsonapi?: IJsonapiMember;
}
export interface IJsonapiBaseResponse extends IJsonapiAbstractResponse {
  meta?: TJsonapiMeta;
  links?: IJsonapiPaginationLinks;
}
/** The `meta` member is required. */
export interface IJsonapiMetaResponse extends IJsonapiBaseResponse {
  meta: TJsonapiMeta;
}
/** The `data` member is required. */
export interface IJsonapiDataResponse<T=IJsonapiDataAttributes> extends IJsonapiBaseResponse {
  data: IJsonapiResponseResource<T> | IJsonapiResponseResource<T>[] | null;
  included?: IJsonapiResource[];
}
/** The `errors` member is required. */
export interface IJsonapiErrorResponse extends IJsonapiBaseResponse {
  errors: IJsonapiError[];
}

/**
 * @see https://jsonapi.org/format/#document-top-level
 */
export interface IJsonapiResponse<T=IJsonapiDataAttributes> extends IJsonapiBaseResponse {
  data?: IJsonapiResource<T> | IJsonapiResource<T>[] | IJsonapiResourceLinkage | null;
  errors?: IJsonapiError[];
  included?: IJsonapiResource[];
}

/** Makes the `state` member required while keeping the others optional. */
export interface IJsonapiStateResponse extends IJsonapiResponse {
  state: INetState;
}

// REQUEST SPECIFICATION //

export interface IJsonapiRequestResource<T=IJsonapiDataAttributes>
  extends IJsonapiResourceAbstract, IJsonapiCompoundDoc
{
  attributes?: T;
  relationships?: IJsonapiDataRelationships;
}

export interface IJsonapiAbstractRequest {
  jsonapi?: IJsonapiMember;
}

export interface IJsonapiBaseRequest extends IJsonapiAbstractRequest {
  meta?: TJsonapiMeta;
  links?: IJsonapiPaginationLinks;
}

export interface IJsonapiRequest<T=IJsonapiDataAttributes>
  extends IJsonapiBaseRequest
{
  data?: IJsonapiRequestResource<T>;
  included?: IJsonapiResource[];
}

export interface IJsonapiRequestClient<T=IJsonapiDataAttributes>
  extends IJsonapiRequest<T>
{
  data: IJsonapiRequestResource<T>;
}
