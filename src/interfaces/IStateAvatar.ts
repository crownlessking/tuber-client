import { AvatarProps } from '@mui/material';

export default interface IStateAvatar {
  icon?: string;
  faIcon?: string;
  /** Don't use more than two letters. */
  text?: string;
  /** Spread me on an avatar component */
  props?: AvatarProps
}
