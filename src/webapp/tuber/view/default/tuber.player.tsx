import { styled } from '@mui/material/styles'
import { Fragment } from 'react'
import {
  IAnnotation,
  IResearchToolbarProps,
  TTuberPlatformMap
} from '../../tuber.interfaces'
import RumblePlayer from '../player.rumble'
import ResearchToolbar from '../tuber.toolbar.video'
import YouTubePlayerApi from '../player.youtube.api'
import VimeoPlayer from '../player.vimeo'
import DailyPlayer from '../player.dailymotion'
import BitChutePlayer from '../player.bitchute'
import OdyseePlayer from '../player.odysee'
import FacebookPlayer from '../player.facebook'
import UnknownPlayer from '../player.unknown'

const VideoCanvas = styled('div')(() => ({
  width: '100%',
  height: '100%',
  backgroundColor: 'rgb(45, 45, 45)'
}))

export const PlayerPlaceholder = styled('div')(() => ({
  width: '100%',
  height: '100%'
}))

interface ITuberPlayer {
  isOpen?: boolean
  annotation?: IAnnotation
  toolbarProps: IResearchToolbarProps
}

function VideoPlayer({ annotation: receivedAnnotation }: { annotation?: IAnnotation }) {
  const annotation = receivedAnnotation ?? {
    platform: '_blank',
    videoid: 'NoVideoAnnotationId',
    startSeconds: 0,
    title: 'No video annotation selected!'
  }
  const players: TTuberPlatformMap = {
    _blank: <PlayerPlaceholder id='playerPlaceholder' />,
    unknown: <UnknownPlayer annotation={annotation} />,
    youtube: <YouTubePlayerApi annotation={annotation} />,
    vimeo: <VimeoPlayer annotation={annotation} />,
    dailymotion: <DailyPlayer annotation={annotation} />,
    rumble: <RumblePlayer annotation={annotation} />,
    bitchute: <BitChutePlayer annotation={annotation} />,
    odysee: <OdyseePlayer annotation={annotation} />,
    facebook: <FacebookPlayer annotation={annotation} />
  }

  return players[annotation.platform]
}

export default function TuberPlayer(props: ITuberPlayer) {
  return (
    <Fragment>
      <VideoCanvas>
        <VideoPlayer annotation={props.annotation} />
      </VideoCanvas>
      <ResearchToolbar {...props.toolbarProps} />
    </Fragment>
  )
}
