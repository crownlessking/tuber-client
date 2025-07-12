import store, { RootState } from '../state';
import StateAllPages from './StateAllPages';
import AbstractState from './AbstractState';
import StateBackground from './StateBackground';
import StateApp from './StateApp';
import StateDrawer from './StateDrawer';
import StateAllForms from './StateAllForms';
import StateFormsData from './StateFormsData';
import StateMeta from './StateMeta';
import StateTypography from './StateTypography';
import StateData from './StateData';
import StateDialog from './StateDialog';
import StateAllErrors from './StateAllErrors';
import StateAllDialogs from './StateAllDialogs';
import StatePagesData from './StatePagesData';
import StateSnackbar from './StateSnackbar';
import StateTmp from './StateTmp';
import StateNet from './StateNet';
import StateAppbarDefault from './templates/StateAppbarDefault';
import StateAppbarQueries from './StateAppbarQueries';
import StateTopLevelLinks from './StateTopLevelLinks';
import StateFormsDataErrors from './StateFormsDataErrors';
import StatePathnames from './StatePathnames';

export default class State extends AbstractState {

  private _appDef?: StateApp;
  private _appbarDef?: StateAppbarDefault;
  private _appbarQueriesDef?: StateAppbarQueries;
  private _backgroundDef?: StateBackground;
  private _typographyDef?: StateTypography;
  private _dataDef?: StateData;
  private _dialogDef?: StateDialog;
  private _allDialogsDef?: StateAllDialogs;
  private _drawerDef?: StateDrawer<this>;
  private _allErrorsDef?: StateAllErrors;
  private _allFormsDef?: StateAllForms;
  private _formsDataDef?: StateFormsData;
  private _formsDataErrorsDef?: StateFormsDataErrors;
  private _metaDef?: StateMeta;
  private _allPagesDef?: StateAllPages;
  private _pagesDataDef?: StatePagesData;
  private _snackbarDef?: StateSnackbar;
  private _tmpDef?: StateTmp;
  private _topLevelLinksDef?: StateTopLevelLinks;
  private _netDef?: StateNet;
  private _pathnamesDef?: StatePathnames;

  /**
   * Get a copy of the (store) state.
   */
  get state(): RootState {
    return this.die(
      `Access to the root state is NOT a good idea.`,
      store.getState()
    );
  }

  /**
   * Chain-access to parent definition.
   */
  get parent(): null {
    return this.die('Root state has no parent.', null);
  }

  get props(): null {
    return this.die(
      'Root state props cannot be used for component spreading.',
      null
    );
  }

  /**
   * Chain-access to app definition.
   */
  get app(): StateApp {
    return this._appDef
      || (this._appDef = new StateApp(
          store.getState().app,
          this
        ));
  }

  /**
   * Get the default appbar definition.
   */
  get appbar(): StateAppbarDefault {
    return this._appbarDef
      || (this._appbarDef = new StateAppbarDefault(
          store.getState().appbar,
          this
        ));
  }

  get appbarQueries(): StateAppbarQueries {
    return this._appbarQueriesDef
      || (this._appbarQueriesDef = new StateAppbarQueries(
            store.getState().appbarQueries,
            this
          ));
  }

  /**
   * Get the default background definition.
   */
  get background(): StateBackground {
    return this._backgroundDef
      || (this._backgroundDef = new StateBackground(
          store.getState().background,
          this
        ));
  }

  get typography(): StateTypography {
    return this._typographyDef
      || (this._typographyDef = new StateTypography(
          store.getState().typography,
          this
        ));
  }

  get data(): StateData {
    return this._dataDef
      || (this._dataDef = new StateData(
        store.getState().data
      ));
  }

  get dialog(): StateDialog {
    return this._dialogDef
      || (this._dialogDef = new StateDialog(
          store.getState().dialog,
          this
        ));
  }

  get allDialogs(): StateAllDialogs {
    return this._allDialogsDef
      || (this._allDialogsDef = new StateAllDialogs(
          store.getState().dialogs,
          this
        ));
  }

  get dialogs(): StateAllDialogs { return this.allDialogs; }

  /**
   * Get the default drawer definition.
   */
  get drawer(): StateDrawer {
    return this._drawerDef
      || (this._drawerDef = new StateDrawer(
          store.getState().drawer,
          this
        ));
  }

  get allErrors(): StateAllErrors {
    return this._allErrorsDef
      || (this._allErrorsDef = new StateAllErrors(
          store.getState().errors,
          this
        ));
  }

  get errors(): StateAllErrors { return this.allErrors; }

  /**
   * Chain-access to all form definitions.
   */
  get allForms(): StateAllForms {
    return this._allFormsDef
      || (this._allFormsDef = new StateAllForms(
          store.getState().forms,
          this
        ));
  }

  get forms(): StateAllForms { return this.allForms; }

  /**
   * Chain-access to forms data.
   */
  get formsData(): StateFormsData {
    return this._formsDataDef
      || (this._formsDataDef = new StateFormsData(
          store.getState().formsData,
          this
        ));
  }

  get formsDataErrors(): StateFormsDataErrors {
    return this._formsDataErrorsDef
      || (this._formsDataErrorsDef = new StateFormsDataErrors(
          store.getState().formsDataErrors,
          this
        ));
  }

  /**
   * Chain-access to metadata.
   */
  get meta(): StateMeta {
    return this._metaDef
      || (this._metaDef = new StateMeta(
          store.getState().meta,
          this
        ));
  }

  /**
   * Chain-access to all page definitions.
   */
  get allPages(): StateAllPages {
    return this._allPagesDef
      || (this._allPagesDef = new StateAllPages(
          store.getState().pages,
          this
        ));
  }

  get pages (): StateAllPages { return this.allPages; }

  get pagesData(): StatePagesData {
    return this._pagesDataDef
      || (this._pagesDataDef = new StatePagesData(
          store.getState().pagesData,
          this
        ));
  }

  get snackbar(): StateSnackbar {
    return this._snackbarDef
      || (this._snackbarDef = new StateSnackbar(
          store.getState().snackbar,
          this
        ));
  }

  get tmp(): StateTmp {
    return this._tmpDef
      || (this._tmpDef = new StateTmp(
          store.getState().tmp,
          this
        ));
  }

  get topLevelLinks(): StateTopLevelLinks {
    return this._topLevelLinksDef
      || (this._topLevelLinksDef = new StateTopLevelLinks(
          store.getState().topLevelLinks,
          this
        ));
  }

  get theme(): any { return store.getState().theme; }

  get net(): StateNet {
    return this._netDef
      || (this._netDef = new StateNet(
        store.getState().net,
      ));
  }

  get pathnames(): StatePathnames {
    return this._pathnamesDef
      || (this._pathnamesDef = new StatePathnames(
        store.getState().pathnames
      ));
  }

} // END class ----------------------------------------------------------------
