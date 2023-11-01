import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import StateForm from '../../../controllers/StateForm'
import StateFormItem from '../../../controllers/StateFormItem'
import { RootState } from '../../../state'
import parse from 'html-react-parser'
import { Fragment } from 'react'
import store, { actions } from '../../../state'
import { get_formatted_route } from 'src/controllers/StateLink'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'

interface IHtmlProps {
  def: StateFormItem<StateForm, string>
}

/* Contains HTML components which are styled so they can use the `sx` prop. */
export const get_styled_div = () => styled('div')(() => ({}))

/** Styled anchor element */
export const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  '&:hover': {
    textDecoration: 'underline'
  }
}))

/** Parse handlebar notations */
export function parseHandlebars(html: string, obj?: {[key: string]: any}) {
  if (!obj) return html
  Object.keys(obj).forEach(key => {
    const value = obj[key] || '&#128681;'
    const re = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    html = html.replace(re, value)
  })
  return html
}

/**
 * Renders HTML as JSX.
 *
 * ```json
 * {
 *   "type": "html",
 *      "props": { "sx": { } },
 *      "has": {
 *        "content": "<div>Hello world!</div>",
 * 
 *         // [optional] page route or key is used if the content is a
 *         // handlebars template. The values will be retrieve from the
 *         // pagesData state. e.g. pagesData.home
 *        "route": "home",
 *         // or
 *        "key": "home"
 *      }
 *   },
 * }
 * ```
 */
export function StateJsxHtml({ def: html }: { def: StateFormItem<StateForm, string> }) {
  let htmlText =  html.has.text || html.has.content
  const pagesDataState = useSelector((state: RootState) => state.pagesData)

  if (html.has.key || html.has.route) {
    const pageData = pagesDataState[html.has.key || html.has.route]
    htmlText = parseHandlebars(html.has.content || html.has.text, pageData)
  }

  return <Box {...html.props} dangerouslySetInnerHTML={{ __html: htmlText }} />
}

/** State html tag */
export const StateJsxHtmlTag: React.FC<IHtmlProps> = ({ def: htmlTag }) => {
  if (htmlTag.has.state.content) {
    const tag = parse(htmlTag.has.content) || null
    if (tag) {
      return <Fragment>{ tag }</Fragment>
    }
  }
  return ( null )
}

/** State version of the HTML anchor tag */
export const StateJsxHtmlA: React.FC<IHtmlProps> = ({ def: link }) => {
  const route = get_formatted_route(link.is)
  const redux = {
    store,
    actions,
    route: link.has.route
  }
  return (
    <Fragment>
      <LinkStyled
        component={RouterLink}
        {...link.props}
        to={route}
        onClick={link.onClick(redux)}
      >
        { link.text }
      </LinkStyled>
    </Fragment>
  )
}