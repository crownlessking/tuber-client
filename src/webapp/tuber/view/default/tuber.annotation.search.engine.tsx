import { Fragment } from 'react'
import Container from '@mui/material/Container'
import { styled } from '@mui/material/styles'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Grid from '@mui/material/Grid'
import { useSelector } from 'react-redux'
import StateData from 'src/controllers/StateData'
import { RootState } from 'src/state'
import { gen_video_url, get_platform_icon_src, shorten_text } from '../../tuber.controller'
import { IAnnotation, ITuberAnnotationsProps } from '../../tuber.interfaces'
import LoadMoreAnnotationsFromServer, { LoadEarlierAnnotationsFromServer } from './tuber.load.more.annotation.list'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import AnnotationActionsToolbar from './tuber.annotation.list.actions'
import { SHORTENED_NOTE_MAX_LENGTH } from '../../tuber.config'

const StyledList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}))

const StyledListItem = styled(ListItem)(() => ({
  float: 'left'
}))

const NoteGrid = styled(Grid)(() => ({
  display: 'flex'
}))

const NoteWrapper = styled('div')(() => ({
  position: 'relative',
  flex: 1
}))

const Note = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(3),
  // maxWidth: theme.spacing(50),
}))

const TitleWrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start'
}))

const Title = styled('a')(() => ({
  textDecoration: 'none',
  fontSize: '1.13rem',
  color: '#1b74e4',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    textDecoration: 'underline',
    cursor: 'pointer'
  }
}))

const PlatformIcon = styled('img')(() => ({
  width: '1.5rem',
  height: '1.5rem',
  margin: '0.25rem 0.5rem 0 0'
}))

const ExpandNoteIconWrapper = styled('a')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'absolute',
  left: 0,
  top: 0,
  textDecoration: 'none',
  color: theme.palette.grey[500],
}))

const ExpandNoteIcon = styled(PlayArrowIcon)(({ theme }) => ({
  width: '1.5rem',
  height: '1.5rem',
}))

const expandNote: boolean[] = []

export default function TuberAnnotationSearchEngine (props: ITuberAnnotationsProps) {
  const { setAnnotationToPlay, playerOpen, setPlayerOpen } = props
  const data = new StateData(
    useSelector((state: RootState) => state.data)
  )
  const annotations = data.configure({endpoint: 'annotations'})
    .collection()
    .get<IAnnotation>()

  const handleOnClick = (
    annotation: IAnnotation,
    playerOpen?: boolean
  ) => (e: React.MouseEvent) => {
    e.preventDefault()
    if (playerOpen) {
      setAnnotationToPlay(annotation)
      setPlayerOpen(true)
    } else {
      // [TODO] Generate platform url.
      const url = annotation.url || gen_video_url(annotation)
      window.open(url, '_blank')?.focus()
    }
  }

  // const handleOnMouseOver = (e: React.MouseEvent) => {
  //   e.preventDefault()
  //   // Accesss dom element directly
  //   const element = e.currentTarget as HTMLLIElement
  //   const children = element.children.item(0) as HTMLDivElement
  //   const grandChild = children.children.item(2) as HTMLDivElement
  //   // Great solution found at: https://stackoverflow.com/a/19929157/1875859
  //   grandChild.style.opacity = '1'
  //   grandChild.style.transition = 'opacity .25s ease-in-out .0s'
  // }

  // const handleOnMouseLeave = (e: React.MouseEvent) => {
  //   e.preventDefault()
  //   // Accesss dom element directly
  //   const element = e.currentTarget as HTMLLIElement
  //   const children = element.children.item(0) as HTMLDivElement
  //   const grandChild = children.children.item(2) as HTMLDivElement
  //   grandChild.style.opacity = '0'
  // }

  const handleExpandDetailIconOnClick = (
    annotaion: IAnnotation,
    i: number
  ) => (e: React.MouseEvent) => {
    e.preventDefault()
    const element = e.currentTarget as HTMLAnchorElement
    const icon = element.children.item(0) as HTMLOrSVGImageElement
    icon.style.transition = 'all 0.4s ease'
    expandNote[i] = !expandNote[i]
    icon.style.transform = expandNote[i]
      ? 'rotateZ(90deg)'
      : 'rotateZ(0deg)'
    const detail = element.parentElement?.children.item(1) as HTMLDivElement
    while (detail.firstChild) {
      detail.removeChild(detail.firstChild)
    }
    if (expandNote[i]) {
      // Insert the full note into the detail div using text node
      detail.appendChild(document.createTextNode(annotaion.note ?? '(No note)'))
    } else {
      // Insert the shortened note into the detail div using text node
      detail.appendChild(document.createTextNode(shorten_text(annotaion.note)))
    }
  }

  return (
    <Container maxWidth='lg'>
      <LoadEarlierAnnotationsFromServer def={data} />
      <StyledList>
        {annotations.map((annotation, i) => (
          <StyledListItem key={`annotation[${i}]`} disablePadding>
            <Stack sx={{ position: 'relative' }}>
              <Grid container direction='row'>
                <TitleWrapper>
                  <PlatformIcon src={get_platform_icon_src(annotation.platform)} />
                  <Title href='#' onClick={handleOnClick(annotation, playerOpen)}>
                    <ListItemText primary={annotation.title} />
                  </Title>
                </TitleWrapper>
              </Grid>
              { annotation.note ? (
                <Fragment>
                  <NoteGrid container direction='row'>
                    <NoteWrapper>
                      {annotation.note.length > SHORTENED_NOTE_MAX_LENGTH ? (
                        <ExpandNoteIconWrapper
                          href='#'
                          onClick={handleExpandDetailIconOnClick(annotation, i)}
                        >
                          <ExpandNoteIcon aria-label='expand row' />
                        </ExpandNoteIconWrapper>
                      ) : ( null )}
                      <Note>{ shorten_text(annotation.note) }</Note>
                    </NoteWrapper>
                  </NoteGrid>
                  <AnnotationActionsToolbar i={i} annotation={annotation} />
                </Fragment>
              ) : (
                <AnnotationActionsToolbar i={i} annotation={annotation} />
              )}
            </Stack>
          </StyledListItem>
        ))}
      </StyledList>
      <LoadMoreAnnotationsFromServer def={data} />
    </Container>
  )
}
