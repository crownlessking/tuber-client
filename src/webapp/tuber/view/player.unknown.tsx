import { styled } from '@mui/material/styles'
import { IBookmark } from '../tuber.interfaces'

interface IUnknown {
  bookmark: IBookmark
}

const IframeWrapperStyled = styled('div')(() => ({
  position: 'relative',
  width: '100%',
  height: '100%'
}))

const IframeStyled = styled('iframe')(() => ({
  width: '100%',
  height: '100%'
}))

const UnknownPlayer: React.FC<IUnknown> = ({ bookmark: { embed_url } }) => (
  <IframeWrapperStyled>
    <IframeStyled
      title='Unknown Platform'
      src={embed_url}
      frameBorder='0'
      scrolling='no'
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  </IframeWrapperStyled>
)

export default UnknownPlayer