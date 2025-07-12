import AbstractState from './AbstractState';
import { IStateFormsDataErrors } from '../interfaces/IState';
import State from './State';

const EXCEPTION_MESSAGE = 'StateFormsDataErrors: configure instance with \'formName\'';

export default class StateFormsDataErrors<T=any> extends AbstractState {
  private _formName?: string;

  constructor (
    private formsDataErrorsState: IStateFormsDataErrors,
    private parentDef?: State
  ) {
    super();
  }

  get parent(): any { return this.parentDef || new State(); }
  get state(): IStateFormsDataErrors { return this.formsDataErrorsState; }
  get props(): any { return this.die('Not implemented yet.', {}); }
  get theme(): any { return this.die('Not implemented yet.', {}); }

  configure({ formName }: { formName: string }) {
    this._formName = formName;
  }

  /** Returns the form's error count. */
  getCount(formName: string): number {
    let errorCount = 0;
    const formErrorsState = this.formsDataErrorsState[formName];
    for (let field in formErrorsState) {
      formErrorsState[field].error && ++errorCount;
    }
    return errorCount;
  }

  hasError(name: keyof T): boolean {
    if (!this._formName) {
      throw new Error(EXCEPTION_MESSAGE);
    }
    const fieldName = name as string;
    return this.formsDataErrorsState[this._formName]?.[fieldName]?.error
      ?? false;
  }

  getError(name: keyof T): boolean {
    if (!this._formName) {
      throw new Error(EXCEPTION_MESSAGE);
    }
    const n = name as string;
    return !!this.formsDataErrorsState[this._formName]?.[n];
  }

  getMessage(name: keyof T): string {
    if (!this._formName) {
      throw new Error(EXCEPTION_MESSAGE);
    }
    const n = name as string;
    return this.formsDataErrorsState[this._formName]?.[n]?.message ?? '';
  }

  get(): any {
    if (!this._formName) {
      throw new Error(EXCEPTION_MESSAGE);
    }
    return this.formsDataErrorsState[this._formName] || {};
  }
}
