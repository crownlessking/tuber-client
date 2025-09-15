import { useMemo } from 'react';
import { StateJsxIcon } from 'src/mui/icon';
import { TPlatform } from '../../tuber.interfaces';
import { TThemeMode } from 'src/common.types';

export interface IPlatformIconProps {
  platform: TPlatform;
  theme?: TThemeMode;
}

export default function PlatformIcon({ platform }: IPlatformIconProps) {
  
  const map = useMemo(() => ({
    '_blank':  <StateJsxIcon name='no_icon' />,
    'youtube': <StateJsxIcon name='youtube' />,
    'vimeo': <StateJsxIcon name='vimeo' />,
    'dailymotion': <StateJsxIcon name='dailymotion' />,
    'rumble': <StateJsxIcon name='rumble' />,
    'odysee': <StateJsxIcon name='odysee' />,
    'facebook': <StateJsxIcon name='facebook' />,
    'twitch': <StateJsxIcon name='twitch' />,
    'unknown': <StateJsxIcon name='unknown' />
  }), []);

  return map[platform];
}