import React, { useCallback, useEffect, useMemo } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import Config from '../../../config';
import { IBookmarkOrigin } from '../tuber.interfaces';

interface IYTPlayerProps {
  bookmark: IBookmarkOrigin;
}

/** @see https://developers.google.com/youtube/iframe_api_reference?csw=1#Getting_Started */
const YouTubePlayerApi = React.memo<IYTPlayerProps>(({ bookmark }) => {
  const {
    videoid,
    platform,
    start_seconds: start,
    end_seconds: end,
  } = bookmark;

  // Memoize YouTube player options
  const opts: YouTubeProps['opts'] = useMemo(() => ({
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      start,
      end
    },
  }), [start, end]);

  // Memoized onReady callback
  const onPlayerReady: YouTubeProps['onReady'] = useCallback((event: any) => {
    Config.write('player', event.target);
  }, []);

  // Handle config writes with useEffect to avoid side effects during render
  useEffect(() => {
    Config.write('videoid', videoid);
    Config.write('platform', platform);
  }, [videoid, platform]);

  return (
    <YouTube
      videoId={videoid}
      opts={opts}
      onReady={onPlayerReady}
      className='youtube'
      iframeClassName='youtube-iframe'
    />
  );
});

// Set display name for debugging
YouTubePlayerApi.displayName = 'YouTubePlayerApi';

export default YouTubePlayerApi;
