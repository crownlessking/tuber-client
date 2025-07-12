import PageSuccess from './pages/success.component';
import PageNotFound from './pages/notfound.component';
import StatePage from '../controllers/StatePage';
import PageErrors from './pages/errors.component';
import PageLanding from './pages/landing.component';
import { remember_exception } from '../business.logic/errors';
import { Fragment } from 'react';
import {
  DEFAULT_BLANK_PAGE_VIEW,
  DEFAULT_ERRORS_PAGE_VIEW,
  DEFAULT_LANDING_PAGE_VIEW,
  DEFAULT_NOTFOUND_PAGE_VIEW,
  DEFAULT_SUCCESS_PAGE_VIEW
} from '../constants';
import PageBlank from './pages/blank.component';
import { err, log } from '../business.logic/logging';

interface IViewTable {
  [constant: string]: ()=>JSX.Element;
}

export default function View({ def: page }: { def: StatePage }): JSX.Element|null {
  const view = (page.contentName).toLowerCase();

  const viewsTable: IViewTable = {
    'table_view': () => {
      err('Not implemented yet.');
      return <Fragment />;
    },
    [DEFAULT_LANDING_PAGE_VIEW]: () => <PageLanding def={page} />,
    [DEFAULT_SUCCESS_PAGE_VIEW]: () => <PageSuccess def={page} />,
    [DEFAULT_NOTFOUND_PAGE_VIEW]: () => <PageNotFound def={page} />,
    [DEFAULT_ERRORS_PAGE_VIEW]: () => <PageErrors def={page} />,
    [DEFAULT_BLANK_PAGE_VIEW]: () => <PageBlank def={page} />,
  }

  try {
    return viewsTable[view]();
  } catch (e: any) {
    remember_exception(e);
    log(e.message);
  }
  return ( null );
}
