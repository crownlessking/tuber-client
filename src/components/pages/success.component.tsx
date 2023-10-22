import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import StatePage from '../../controllers/StatePage'
import { get_page_name } from '../../controllers'
import { styled } from '@mui/material'

const MsgDiv = styled('div')(() => ({
  width: '100%',
  textAlign: 'center'
}))

/**
 * Displays a generic page that indicates a successful operation.
 *
 * example:
 * ```tsx
 * <SuccessPage endpoint={endpoint} state={state} />
 * ```
 * ##### Variables
 * `message`: text to be displayed on the success page.
 *
 * example:
 * ```ts
 * displayPage('success', {
 *    message: 'I\'ll show up at the bottom of the page'
 * })
 * ```
 *
 * Tags: `success`, `page`, `message`
 */
export default function PageSuccess ({ def: page }:{ def: StatePage }) {
  const route = page.parent.parent.app.route
  const pageName = get_page_name(route)
  const msg = page.parent.parent.tmp.get(
    pageName,
    'message',
    page.data.message
  )

  return (
    <>
      <CheckCircleOutlineIcon
        sx={{ fontSize: '29.5rem !important' }}
        htmlColor={page.typography.color}
      />
      <MsgDiv style={{color: page.typography.color}}>
        <h1>{ msg }</h1>
      </MsgDiv>
    </>
  )

}
