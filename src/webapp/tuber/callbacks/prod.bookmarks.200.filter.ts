import StateApp from 'src/controllers/StateApp';
import StateAppbarQueries from 'src/controllers/StateAppbarQueries';
import StateData from 'src/controllers/StateData';
import { IRedux } from 'src/state';
import { IBookmark } from '../tuber.interfaces';

export default function appbar_filter_bookmarks(redux: IRedux) {
  return async () => {
    const dispatch = redux.store.dispatch;
    const rootState = redux.store.getState();
    const data = new StateData(rootState.data);
    data.configure({ dispatch, endpoint: 'bookmarks' });
    const route = new StateApp(rootState.app).route;
    const queries = new StateAppbarQueries(rootState.appbarQueries);
    const queryObj = queries.get(route);
    const filter = queryObj?.value?.toLowerCase() ?? '';
    const bookmarks = data
      .collection()
      .get<IBookmark>();
    const bookmarksFiltered = bookmarks.filter(bookmark => {
      if (bookmark.title.toLowerCase().includes(filter.toLowerCase())) {
        return true;
      }
      if (bookmark.note?.toLowerCase().includes(filter.toLowerCase())) {
        return true;
      }
      if (bookmark.tags
        && bookmark.tags.includes(filter.toLowerCase()))
      {
        return true;
      }
      return false;
    });
    dispatch({ type: 'bookmarks/bookmarksFiltered', payload: bookmarksFiltered });
  };
}