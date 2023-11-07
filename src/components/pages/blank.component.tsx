import { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { post_req_state } from '../../state/net.actions'
import StatePage from '../../controllers/StatePage'
import { AppDispatch } from '../../state'
import Config from '../../config'
import { ALLOWED_ATTEMPTS } from '../../constants'

export default function PageBlank ({ def: page }:{ def: StatePage }) {
  const dispatch = useDispatch<AppDispatch>()
  
  useEffect(() => {
    const { route: key } = page.parent.parent.app
    if (!key) { return }
    const { fetchingStateAllowed } = page.parent.parent.app
    if (!fetchingStateAllowed) { return }
    const { headers } = page.parent.parent.net
    const { PAGES } = page.parent.parent.pathnames
    const pageLoadAttempts = Config.read<number>(`${key}_load_attempts`, 0)
    if (pageLoadAttempts < ALLOWED_ATTEMPTS) {
      dispatch(post_req_state(PAGES, { key }, headers))
      Config.write(`${key}_load_attempts`, pageLoadAttempts + 1)
    }
  }, [ dispatch, page ])

  return <Fragment />
}