import StateAvatar from '../StateAvatar';
import * as colors from '@mui/material/colors';

interface IColors {
  [color: string]: {
    [x: number]: string;
  }
}

export default class StateAvatarLetter extends StateAvatar {

  private getRandomColor() {
    const pick = Math.floor(Math.random() * (19 + 1));
    const colorMap = [
      'amber', 'blue', 'blueGrey', 'brown', 'common', 'cyan','deepOrange',
      'deepPurple', 'green', 'grey', 'indigo', 'lightBlue', 'lightGreen',
      'lime', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow'
    ];
    return colorMap[pick];
  }

  get props() {
    const avatarJsonProps = this.avatarState.props || {};
    const allColors = colors as IColors;
    return {
      sx: {
        bgColor: allColors[this.getRandomColor()][500]
      },
      ...avatarJsonProps
    };
  }

}
