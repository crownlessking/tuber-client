// import logo from './logo.svg'
// import './App.css'
import { useEffect } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './state'
import { post_req_state } from './state/net.actions'
import { get_bootstrap_key } from './state/_business.logic'
import Config from './config'
import { createTheme, ThemeProvider } from '@mui/material'
import StateAllPages from './controllers/StateAllPages'
import StateApp from './controllers/StateApp'
import StateNet from './controllers/StateNet'
import AppPage from './components/app.component'
/**
 * Making all FontAwesome 'Regular', 'Solid', and 'Brand' icons available
 * throughout the entire application
 *
 * just do:
 * ```javascript
 * import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
 *
 * const icon = <FontAwesomeIcon icon='coffee' />
 * ```
 *
 * @see https://www.npmjs.com/package/@fortawesome/react-fontawesome
 * for more info
 */
library.add(fab, fas, far)

export default function App() {
  const dispatch = useDispatch<AppDispatch>()
  const app = new StateApp(
    useSelector((state: RootState) => state.app)
  )
  const allPages = new StateAllPages(
    useSelector((state: RootState) => state.pages)
  )
  allPages.app = app
  const net = new StateNet(
    useSelector((state: RootState) => state.net)
  )
  const themeState = useSelector((state: RootState) => state.theme)

  /** Get a page from server. */
  const onPostReqHomePageState = () => {
    const key = get_bootstrap_key()
    const pageLoadAttempts = Config.read<number|undefined>('page_load_attempts')
      ?? 0

    if (pageLoadAttempts < Config.ALLOWED_ATTEMPTS && key) {
      // [TODO] There is no need to send headers here.
      dispatch(post_req_state(key, {}, net.headers))
      Config.write('page_load_attempts', pageLoadAttempts + 1)
    }
  }

  useEffect(() => {

    // Get a page from server if none was provided.
    // Setting `isBootstrapped` to `true` will prevent it.
    if (!app.isBootstrapped) {
      onPostReqHomePageState()
    }
  })

  return (
    <ThemeProvider theme={createTheme(themeState)}>
      <AppPage def={allPages} />
    </ThemeProvider>
  )
}