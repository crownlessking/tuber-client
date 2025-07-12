import Controller from './AbstractState';
import State from './State';
import StateForm from './StateForm';
import IStateAllForms from '../interfaces/IStateAllForms';
import { log } from '../business.logic/logging';

export default class StateAllForms extends Controller {

  private _allFormsState: IStateAllForms;
  private _parentDef?: State;
  private _lastFormName: string;

  constructor (allFormsState: IStateAllForms, parent?: State) {
    super();
    this._parentDef = parent;
    this._allFormsState = allFormsState;
    this._lastFormName = '';
  }

  /** Get all forms json. */
  get state(): IStateAllForms { return this._allFormsState; }
  /** Chain-access to root definition. */
  get parent(): State { return this._parentDef || new State(); }
  get props(): any { return this.die('Not implemented yet.', {}); }
  get theme(): any { return this.die('Not implemented yet.', {}); }

  getForm = (name: string): StateForm | null => {
    const formName = this.getStateFormName(name);
    const formState = this._allFormsState[formName];

    if (formState) {
      this._lastFormName = formName;
      const formDef = new StateForm(formState, this);

      return formDef;
    }

    log(`${formName} not found or misspelled.`);
    return null;
  }

  /**
   * Get the (`formName`) name of the last form that was retrieved.
   */
  getLastFormName = (): string => this._lastFormName;

  /**
   * Get the form state name
   *
   * __Problem__: We needed a way to get the `formName` without the use of any
   * other information. This problem arised while attempting to display a form
   * in the fullscreen dialog of the virtualized table, which appears when
   * clicking on a row to edit or view data in greater detail.
   *
   * @param name 
   */
  private getStateFormName = (name: string): string => {
    return name + 'Form';
  };

}
