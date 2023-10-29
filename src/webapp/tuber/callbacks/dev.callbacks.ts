
import {
  delete_req_state,
  get_req_state,
  post_req_state
} from 'src/state/net.actions'
import { IRedux } from '../../../state'
import {
  dev_create_bookmark_search_index,
  dev_get_bookmarks_callback
} from './dev.bookmarks.200'
import { safely_get_as } from 'src/controllers'
import { remember_exception } from 'src/state/_errors.business.logic'

function dev_create_user(redux: IRedux) {
  return () => {
    const { store: { dispatch } } = redux
    dispatch(post_req_state('install-dev/user', {
      'message': 'Hello from the other side'
    }))
  }
}

function dev_reset_database(redux: IRedux) {
  return () => {
    const { store: { dispatch } } = redux
    dispatch(post_req_state('install-dev/database-reset', {
      'message': 'Hello from client. I hope everything is okay.'
    }))
  }
}

function dev_load_drawer(redux: IRedux) {
  return () => {
    const { store: { dispatch } } = redux
    dispatch(post_req_state('install-dev/load-test-drawer', {
      'message': 'Testing partial page load'
    }))
  }
}

function dev_unload_drawer(redux: IRedux) {
  return () => {
    const { store: { dispatch } } = redux
    dispatch(post_req_state('install-dev/unload-test-drawer', {}))
  }
}

function dev_clipboard_test(redux: IRedux) {
  return async () => {
    let value: string
    try {
      value = await navigator.clipboard.readText()
    } catch (e: any) {
      value = e.message
      remember_exception(e, `dev_clipboard_test: ${value}`)
    }
    redux.store.dispatch({
      type: 'formsData/formsDataUpdate',
      payload: {
        formName: 'devInstallForm',
        name: 'clipboard-test',
        value
      }
    })
  }
}

function dev_user_add(redux: IRedux) {
  return async () => {
    // [TODO] Implement to add functionality to add a user when the button is
    //        clicked.
  }
}

function dev_user_populate(redux: IRedux) {
  return async () => {
    // [TODO] Implement to add functionality to populate the user list when the
    //        button is clicked.
  }
}

function dev_no_response(redux: IRedux) {
  return async () => {
    const { store: { dispatch } } = redux
    dispatch(get_req_state('install-dev/no-response/30000'))
  }
}

function dev_drop_collection(redux: IRedux) {
  return async () => {
    const { store: { dispatch, getState } } = redux
    const collection = safely_get_as<string>(
      getState(),
      'formsData.devInstallForm.drop-collection',
      ''
    )
    if (!collection) { return }
    dispatch(delete_req_state(`install-dev/drop-collection/${collection}`))
  }
}

function dev_populate_collection(redux: IRedux) {
  return async () => {
    const { store: { dispatch, getState } } = redux
    const collection = safely_get_as<string>(
      getState(),
      'formsData.devInstallForm.populate-collection',
      ''
    )
    const quantity = safely_get_as<number>(
      getState(),
      'formsData.devInstallForm.population-quantity',
      0
    )
    if (!collection || !quantity) {
      return
    }
    dispatch(post_req_state(
      `install-dev/populate-collection`,
      {
        collection,
        quantity
      }
    ))
  }
}

const devCallbacks = {
  devCreateUser: dev_create_user,
  devResetDatabase: dev_reset_database,
  devLoadDrawer: dev_load_drawer,
  devUnloadDrawer: dev_unload_drawer,
  devClipboardTest: dev_clipboard_test,
  devUserAdd: dev_user_add,
  devUserPopulate: dev_user_populate,
  devGetBookmarks: dev_get_bookmarks_callback,
  devNoResponse: dev_no_response,
  devDropCollection: dev_drop_collection,
  devPopulateCollection: dev_populate_collection,
  devCreateBookmarkSearchIndex: dev_create_bookmark_search_index
}

export default devCallbacks