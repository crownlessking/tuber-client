import { useMemo, memo } from 'react';
import StateBackground from '../../controllers/StateBackground';
import StatePage from '../../controllers/StatePage';
import Fade from '@mui/material/Fade';
import { Box, styled } from '@mui/material';

// Memoize the styled component outside of render to prevent recreation
const BackgroundStyledBox = styled(Box)(() => ({
  height: 'inherit',
  position: 'absolute',
  left: 0,
  right: 0,
  zIndex: -9999,
}));

interface IBackgroundProps {
  def: StateBackground<StatePage>;
  children?: any;
}

const Background = memo(function Background(
  { def: background, children }: IBackgroundProps
) {
  // Memoize the sx prop to prevent unnecessary recalculations
  const sx = useMemo(() => background.sx, [background]);

  return (
    <Fade in={true}>
      <BackgroundStyledBox
        sx={sx}
      >
        { children }
      </BackgroundStyledBox>
    </Fade>
  );
});

export default Background;
