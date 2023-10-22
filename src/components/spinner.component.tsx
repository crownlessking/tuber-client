import { CircularProgress, styled } from '@mui/material'
import { LayoutCenteredNoScroll } from '../mui/layouts'
import { RootState } from '../state'
import { useSelector } from 'react-redux'

const Background = styled('div')(() => ({
  width: '100%',
  overflow: 'auto',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
  backgroundColor: 'rgba(255,255,255,0.8)'
}))

/** Spinner */
export default function Spinner() {
  const showSpinner = useSelector((state: RootState) => state.app.showSpinner)
  const spinnerDisabled = useSelector((state: RootState) => state.app.spinnerDisabled)
  const open = showSpinner && !spinnerDisabled

  return (
    <Background style={{display: open ? 'block' : 'none'}}>
      <LayoutCenteredNoScroll>
        <CircularProgress
          color='secondary'
          size={60}
          thickness={5}
        />
      </LayoutCenteredNoScroll>
    </Background>
  )
}
