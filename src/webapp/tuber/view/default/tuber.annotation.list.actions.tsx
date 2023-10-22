import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import StateLink from 'src/controllers/StateLink'
import JsonLink from 'src/mui/link'
import { dialog_edit_annotation } from '../../callbacks/prod.annotations.actions'
import {
  dialog_delete_annotation
} from '../../callbacks/prod.annotations.actions'
import { IAnnotation } from '../../tuber.interfaces'
import { get_ratio_color } from './_business.logic'

interface IAnnotationActionToolbarProps {
  i: number
  annotation: IAnnotation
}

interface IRatingProps {
  annotation: IAnnotation
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? '#1A2027'
    : theme.palette.grey[200],
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.grey[600],
  opacity: 0
}))

const RatingWrapper = styled('span')(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
  padding: theme.spacing(.25),
  borderRadius: '10%'
}))

const Rating = styled(Grid)(() => ({
  paddingTop: 4,
}))

const SpanStyled = styled('span')(() => ({}))

const EditAction = (props:{index:number}) => {
  
  return (
    <JsonLink def={new StateLink({
      'type': 'icon',
      'onClick': dialog_edit_annotation(props.index),
      'props': { 'size': 'small' },
      'has': {
        'faIcon': 'fa-pen-to-square',
      },
    })} />
  )
}

const SettingAction = () => {
  return (
   <JsonLink def={new StateLink({
     'type': 'icon',
     'props': { 'size': 'small' },
     'has': {
       'faIcon': 'fa-cog',
     },
   })} />
  )
}

const DeleteAction = ({ index }:{ index:number }) => {
  return (
    <JsonLink def={new StateLink({
      'type': 'icon',
      'onClick': dialog_delete_annotation(index),
      'props': { 'size': 'small' },
      'has': {
        'faIcon': 'fa-trash-can',
      },
    })} />
  )
}

const UpVoteAction = () => {
  return (
    <JsonLink def={new StateLink({
      'type': 'icon',
      'props': { 'size': 'small' },
      'has': {
        'faIcon': 'far, thumbs-up',
      },
    })} />
  )
}

const DownVoteAction = () => {
  return (
    <JsonLink def={new StateLink({
      'type': 'icon',
      'props': { 'size': 'small' },
      'has': {
        'faIcon': 'far, thumbs-down',
      },
    })} />
  )
}

const BookmarkAction = () => {
  return (
    <JsonLink def={new StateLink({
      'type': 'icon',
      'props': { 'size': 'small' },
      'has': {
        'faIcon': 'far, fa-bookmark',
      },
    })} />
  )
}

const ColorCodedRating: React.FC<IRatingProps> = ({ annotation }) => {
  const { upvotes, downvotes } = annotation
  const ratioColor = get_ratio_color(upvotes, downvotes)
  const up = parseInt(upvotes || '0')
  const down = parseInt(downvotes || '0')
  const rating = up - down

  return (
    <Rating item>
      <RatingWrapper>
        <SpanStyled sx={{ color: 'grey.700' }}>Rank:&nbsp;</SpanStyled>
        <SpanStyled sx={{ color: ratioColor }}>
          { rating !== 0 ? rating : '--' }
        </SpanStyled>
      </RatingWrapper>
    </Rating>
  )
}

const handleOnMouseOver = (e: React.MouseEvent) => {
  e.preventDefault()
  const element = e.currentTarget as HTMLLIElement
  // Great solution found at: https://stackoverflow.com/a/19929157/1875859
  element.style.opacity = '1'
  element.style.transition = 'opacity .25s ease-in-out .0s'
}

const handleOnMouseLeave = (e: React.MouseEvent) => {
  e.preventDefault()
  const element = e.currentTarget as HTMLLIElement
  element.style.opacity = '0'
}

export default function AnnotationActionsToolbar({ i, annotation }: IAnnotationActionToolbarProps) {
  return (
    <Grid container direction='row'>
      <ColorCodedRating annotation={annotation} />
      <StyledPaper
        elevation={0}
        onMouseOver={handleOnMouseOver}
        onMouseLeave={handleOnMouseLeave}
      >
        <Grid container direction='row'>
          { /* Add toolbar actions here */ }
          <UpVoteAction />
          <DownVoteAction />
          <BookmarkAction />
          <EditAction index={i} />
          <DeleteAction index={i} />
          <SettingAction />
          <div>{i}</div>
        </Grid>
      </StyledPaper>
    </Grid>
  )
}
