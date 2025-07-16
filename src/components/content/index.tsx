import { useMemo, useCallback } from 'react';
import View from '../view.component';
import StatePage from '../../controllers/StatePage';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../state';
import { post_req_state } from '../../state/net.actions';
import IStateApp from '../../interfaces/IStateApp';
import IStateAllForms from '../../interfaces/IStateAllForms';
import IStatePage from '../../interfaces/IStatePage';
import HtmlContent from './html.component';
import { APP_CONTENT_VIEW } from '../../constants';
import { remember_exception } from 'src/business.logic/errors';
import FormContent from './form.component';
import WebApps from './webapp.content.component';
import {
  get_last_content_jsx,
  get_state_form_name,
  save_content_jsx,
} from '../../business.logic';
import { ler } from '../../business.logic/logging';

export interface IContentState {
  stateApp: IStateApp;
  stateForms: IStateAllForms;
  statePage: IStatePage;
}

interface IContentProps {
  def: StatePage;
}

interface IContentTable {
  [constant: string]: () => JSX.Element | null;
}

/**
 * Application content
 */
export default function Content (props: IContentProps) {
  const { def: page } = props;
  const dispatch = useDispatch<AppDispatch>();

  // Memoize constants to prevent re-creation on every render
  const contentConstants = useMemo(() => ({
    APP_CONTENT_FORM: '$form',
    APP_CONTENT_WEBAPP: '$webapp',
    APP_CONTENT_HTML: '$html',
    APP_CONTENT_FORM_LOAD: '$form_load',
    APP_CONTENT_HTML_LOAD: '$html_load'
  }), []);

  // Memoize the page content type computation
  const type = useMemo(() => page.contentType.toLowerCase(), [page.contentType]);

  // Memoize form computation for form content type
  const formData = useMemo(() => {
    if (type === contentConstants.APP_CONTENT_FORM) {
      const form = page.parent.parent.allForms.getForm(page.contentName);
      if (form) { 
        form.endpoint = page.contentEndpoint; 
      }
      return form;
    }

    return null;
  }, [
    type,
    contentConstants.APP_CONTENT_FORM,
    page.parent.parent.allForms,
    page.contentName,
    page.contentEndpoint,
  ]);

  // Memoize form load state computation
  const formLoadState = useMemo(() => {
    if (type === contentConstants.APP_CONTENT_FORM_LOAD) {
      return {
        fetchingStateAllowed: page.parent.parent.app.fetchingStateAllowed,
        FORMS: page.parent.parent.pathnames.FORMS,
        key: get_state_form_name(page.contentName)
      };
    }
    return null;
  }, [
    type,
    contentConstants.APP_CONTENT_FORM_LOAD,
    page.parent.parent.app.fetchingStateAllowed,
    page.parent.parent.pathnames.FORMS,
    page.contentName
  ]);

  // Memoize content handlers using useCallback
  const handleFormContent = useCallback(() => {
    const contentJsx = (
      <FormContent
        formName={page.contentName}
        def={formData}
        type={'page'}
      />
    );
    save_content_jsx(contentJsx);
    return contentJsx;
  }, [formData, page.contentName]);

  const handleViewContent = useCallback(() => {
    const contentJsx = <View def={page} />;
    save_content_jsx(contentJsx);
    return contentJsx;
  }, [page]);

  const handleWebAppContent = useCallback(() => {
    let contentJsx: JSX.Element | null = null;
    try {
      contentJsx = <WebApps def={page} />;
      if (contentJsx) {
        save_content_jsx(contentJsx);
      } else {
        save_content_jsx(contentJsx = null);
      }
    } catch (e: any) {
      const message = `Bad page content.\n${e.message}`;
      ler(message);
      remember_exception(e, message);
      save_content_jsx(contentJsx = null);
    }
    return contentJsx;
  }, [page]);

  const handleHtmlContent = useCallback(() => {
    const contentJsx = <HtmlContent def={page} />;
    save_content_jsx(contentJsx);
    return contentJsx;
  }, [page]);

  const handleFormLoad = useCallback(() => {
    if (formLoadState?.fetchingStateAllowed) {
      dispatch(post_req_state(formLoadState.FORMS, {
        key: formLoadState.key,
      }));
    }
    save_content_jsx(null);
    return null;
  }, [dispatch, formLoadState ]);

  const handleHtmlLoad = useCallback(() => {
    save_content_jsx(null);
    return null;
  }, []);

  const handleDefault = useCallback(() => {
    return get_last_content_jsx();
  }, []);

  // Memoize the content table to prevent re-creation
  const contentTable: IContentTable = useMemo(() => ({
    [contentConstants.APP_CONTENT_FORM]: handleFormContent,
    [APP_CONTENT_VIEW]: handleViewContent,
    [contentConstants.APP_CONTENT_WEBAPP]: handleWebAppContent,
    [contentConstants.APP_CONTENT_HTML]: handleHtmlContent,
    [contentConstants.APP_CONTENT_FORM_LOAD]: handleFormLoad,
    [contentConstants.APP_CONTENT_HTML_LOAD]: handleHtmlLoad,
    $default: handleDefault,
  }), [
    contentConstants,
    handleFormContent,
    handleViewContent,
    handleWebAppContent,
    handleHtmlContent,
    handleFormLoad,
    handleHtmlLoad,
    handleDefault,
  ]);

  // Memoize the final content JSX computation
  const contentJsx = useMemo(() => {
    let result: JSX.Element | null = null;

    try {
      const handler = contentTable[type] || contentTable['$default'];
      result = handler();
    } catch (e: any) {
      const message = `Bad page content. ${e.message}`;
      ler(message);
      remember_exception(e, message);
      result = contentTable['$default']();
    }

    return result;
  }, [ contentTable, type ]);

  return contentJsx;
}
