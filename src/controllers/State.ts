import { type RootState, get_state } from '../state';
import StateAllPages from './StateAllPages';
import StateAllIcons from './StateAllIcons';
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
  private __rootState?: RootState;
  private _appDef?: StateApp;
  private _appbarDef?: StateAppbarDefault;
  private _appbarQueriesDef?: StateAppbarQueries;
  private _backgroundDef?: StateBackground;
  private _typographyDef?: StateTypography;
  private _allIconsDef?: StateAllIcons;
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

  private get _rootState(): RootState {
    return this.__rootState || (this.__rootState = get_state());
  }

  /**
   * Get a copy of the (store) state.
   */
  get state(): RootState {
    return this.die(
      `Access to the root state is NOT a good idea.`,
      this._rootState
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
          this._rootState.app,
          this
        ));
  }

  /**
   * Get the default appbar definition.
   */
  get appbar(): StateAppbarDefault {
    return this._appbarDef
      || (this._appbarDef = new StateAppbarDefault(
          this._rootState.appbar,
          this
        ));
  }

  get appbarQueries(): StateAppbarQueries {
    return this._appbarQueriesDef
      || (this._appbarQueriesDef = new StateAppbarQueries(
            this._rootState.appbarQueries,
            this
          ));
  }

  /**
   * Get the default background definition.
   */
  get background(): StateBackground {
    return this._backgroundDef
      || (this._backgroundDef = new StateBackground(
          this._rootState.background,
          this
        ));
  }

  get typography(): StateTypography {
    return this._typographyDef
      || (this._typographyDef = new StateTypography(
          this._rootState.typography,
          this
        ));
  }

  /**
   * Chain-access to all icon definitions.
   */
  get allIcons(): StateAllIcons {
    return this._allIconsDef
      || (this._allIconsDef = new StateAllIcons(
          this._rootState.icons,
          this
        ));
  }

  get icons(): StateAllIcons { return this.allIcons; }

  get data(): StateData {
    return this._dataDef
      || (this._dataDef = new StateData(
        this._rootState.data
      ));
  }

  get dialog(): StateDialog {
    return this._dialogDef
      || (this._dialogDef = new StateDialog(
          this._rootState.dialog,
          this
        ));
  }

  get allDialogs(): StateAllDialogs {
    return this._allDialogsDef
      || (this._allDialogsDef = new StateAllDialogs(
          this._rootState.dialogs,
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
          this._rootState.drawer,
          this
        ));
  }

  get allErrors(): StateAllErrors {
    return this._allErrorsDef
      || (this._allErrorsDef = new StateAllErrors(
          this._rootState.errors,
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
          this._rootState.forms,
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
          this._rootState.formsData
        ));
  }

  get formsDataErrors(): StateFormsDataErrors {
    return this._formsDataErrorsDef
      || (this._formsDataErrorsDef = new StateFormsDataErrors(
          this._rootState.formsDataErrors,
          this
        ));
  }

  /**
   * Chain-access to metadata.
   */
  get meta(): StateMeta {
    return this._metaDef
      || (this._metaDef = new StateMeta(
          this._rootState.meta,
          this
        ));
  }

  /**
   * Chain-access to all page definitions.
   */
  get allPages(): StateAllPages {
    return this._allPagesDef
      || (this._allPagesDef = new StateAllPages(
          this._rootState.pages,
          this
        ));
  }

  get pages (): StateAllPages { return this.allPages; }

  get pagesData(): StatePagesData {
    return this._pagesDataDef
      || (this._pagesDataDef = new StatePagesData(
          this._rootState.pagesData,
          this
        ));
  }

  get snackbar(): StateSnackbar {
    return this._snackbarDef
      || (this._snackbarDef = new StateSnackbar(
          this._rootState.snackbar,
          this
        ));
  }

  get tmp(): StateTmp {
    return this._tmpDef
      || (this._tmpDef = new StateTmp(
          this._rootState.tmp,
          this
        ));
  }

  get topLevelLinks(): StateTopLevelLinks {
    return this._topLevelLinksDef
      || (this._topLevelLinksDef = new StateTopLevelLinks(
          this._rootState.topLevelLinks,
          this
        ));
  }

  get theme(): unknown { return this._rootState.theme; }

  get net(): StateNet {
    return this._netDef
      || (this._netDef = new StateNet(
        this._rootState.net,
      ));
  }

  get pathnames(): StatePathnames {
    return this._pathnamesDef
      || (this._pathnamesDef = new StatePathnames(
        this._rootState.pathnames
      ));
  }

} // END class ----------------------------------------------------------------
