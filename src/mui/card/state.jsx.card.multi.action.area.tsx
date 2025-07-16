import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import { Button, CardActionArea, CardActions } from '@mui/material'
import type StateCardMultiActionArea
  from 'src/controllers/templates/StateCardMultiActionArea'

interface ICardProps {
  def: StateCardMultiActionArea
}

export default function StateJsxCard({ def: card }: ICardProps) {
  return (
    <Card {...card.props}>
      <CardActionArea {...card.actionArea}>
        <CardMedia {...card.mediaProps} />
        <CardContent>
          { card.contentProps.children }
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
      </CardActions>
    </Card>
  )
}