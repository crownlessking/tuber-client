import { Fragment } from 'react';
import IStatePage from 'src/interfaces/IStatePage';
import StateAllPages from 'src/controllers/StateAllPages';
import ComplexApp from './complex.app.component';
import GenericApp from './generic.app.component';
import StateApp from 'src/controllers/StateApp';

interface IGenericAppProps {
  def: StateAllPages,
  info: StateApp
}

export default function AppPage({
  def: allPages,
  info: app
}: IGenericAppProps) {
  const page = allPages.getPage(app);

  const AppMap: Record<
    Required<IStatePage>['_type'],
    JSX.Element | null
  > = {
    'generic': <GenericApp def={page} />,
    'complex': <ComplexApp def={page} />,
  };

  return (
    <Fragment>
      { AppMap[page._type] }
    </Fragment>
  );
}