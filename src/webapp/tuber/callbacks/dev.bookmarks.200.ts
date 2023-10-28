import { get_req_state, post_req_state } from 'src/state/net.actions'
import { IRedux } from '../../../state'

/** Get collection of bookmarks from server using a get request */
export function dev_get_bookmarks_callback (redux: IRedux, args = '') {
  return async () => {
    const { store: { dispatch } } = redux
    dispatch(get_req_state('bookmarks', args))
  }
}

// [TODO] Get a single bookmark from server using post request

export function dev_create_bookmark_search_index (redux: IRedux) {
  return async () => {
    redux.store.dispatch(post_req_state(
      'install-dev/setup-collection-index-search/bookmarks',
      {}
    ))
  }
}