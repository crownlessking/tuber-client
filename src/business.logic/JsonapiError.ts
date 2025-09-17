import { mongo_object_id } from './utility';
import {
  IJsonapiError,
  IJsonapiErrorLinks,
  IJsonapiErrorSource,
  TJsonapiErrorStatus,
  TJsonapiMeta
} from '../interfaces/IJsonapi';

export default class JsonapiError implements IJsonapiError {
  private _idJson?: string;

  constructor(private _e: IJsonapiError) {}

  get json(): IJsonapiError { return this._e; }
  get id(): string {
    return this._idJson || (this._idJson = this._e.id || mongo_object_id());
  }
  get links(): IJsonapiErrorLinks { return this._e.links ?? {}; }
  get status(): TJsonapiErrorStatus { return this._e.status ?? '200'; }
  get code()  { return this._e.code; }
  get title() { return this._e.title; }
  get detail(): string { return this._e.detail ?? ''; }
  get source(): IJsonapiErrorSource { return this._e.source ?? {}; }
  get meta(): TJsonapiMeta { return this._e.meta ?? {}; }
}
