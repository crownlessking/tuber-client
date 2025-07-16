import StateAvatar from '../StateAvatar';

export interface IStateAvatarImageProps {
  alt: string;
  src: string;
}

export default class StateAvatarImage extends StateAvatar {

  get props(): IStateAvatarImageProps {
    const avatarJsonProps = this.avatarState.props || {};
    return {
      alt: avatarJsonProps.alt || this.die(
        `\`StateAvatarImage.props.alt\` is undefined.`,
        ''
      ),
      src: avatarJsonProps.src || this.die(
        `\`StateAvatarImage.props.src\` is undefined.`,
        ''
      )
    };
  }
}
