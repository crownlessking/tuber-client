import AbstractState from './AbstractState';
import IStateAvatar from '../interfaces/IStateAvatar';
import StateFormItemCustom from './StateFormItemCustom';

export default class StateAvatar extends AbstractState implements IStateAvatar {
  protected avatarState: IStateAvatar;

  constructor(avatarState: IStateAvatar) {
    super();
    this.avatarState = avatarState;
  }

  get parent(): any {
    return this.die('Avatar state does not have a parent.', {});
  }
  get theme(): any { return this.die('Not implemented yet.', {}); }
  get props(): any {
    return this.avatarState.props || {
      variant: 'circular'
    };
  }
  get state() { return this.avatarState; }

  get icon() { return this.avatarState.icon; }
  get faIcon() { return this.avatarState.faIcon; }
  get text() { return this.avatarState.text ?? ''; }

  get jsonIcon() {
    return new StateFormItemCustom({
      icon: this.avatarState.icon,
      faIcon: this.avatarState.faIcon
    }, this);
  }
}
