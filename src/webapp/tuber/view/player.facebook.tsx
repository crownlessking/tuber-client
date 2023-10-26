import { styled } from '@mui/material/styles'
import { IAnnotation } from '../tuber.interfaces'

interface IFacebookPlayerProps {
  annotation: IAnnotation
}
const StyledIframeWrapper = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow:'hidden',
  position:'relative',
  height: '100%'
}))

const IframeStyled = styled('iframe')(() => ({
  border: 'none',
  overflow: 'hidden',
}))

const FacebookPlayer: React.FC<IFacebookPlayerProps> = ({ annotation }) => {
  const { author, videoid, start_seconds } = annotation
  const start = start_seconds ?? 0
  // Example slug: MetroUK%2Fvideos%2F7129126943765650
  const slug = `${author}%2Fvideos%2F${videoid}`
  const height = '476'
  const width = '476'
  const src = `https://www.facebook.com/plugins/video.php?height=${height}`
    + `&href=https%3A%2F%2Fwww.facebook.com%2F${slug}%2F&show_text=false&width=${width}&t=${start}`
  return (
    <StyledIframeWrapper>
      <IframeStyled
        src={src}
        width="476"
        height="476"
        scrolling='no'
        frameBorder='0'
        allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
        allowFullScreen
      />
    </StyledIframeWrapper>
  )
}

export default FacebookPlayer