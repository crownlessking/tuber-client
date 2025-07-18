import { Fragment } from 'react';
import { Icon, Button } from '@mui/material';
import type StateFormItem from 'src/controllers/StateFormItem';
import store, { actions } from 'src/state';
import type StateDialog from '../../../controllers/StateDialog';

interface IJsonButtonProps { def: StateFormItem<StateDialog>; }
interface IJsonButtonContentProps {
  def: StateFormItem<StateDialog>;
}

export default function StateJsxDialogActionButton (
  { def: button }: IJsonButtonProps
) {
  const redux = {
    store,
    actions,
    route: button.props.href
  };
  const onClick = button.onClick;

  const ButtonContent = ({ def: button }: IJsonButtonContentProps) => {
    if (button.text) {
      switch (button.has.iconPosition) {

      // icon is located on the right of the button title
      case 'right':
        if (button.has.icon) {
          return (
            <Fragment>
              { button.text }
              &nbsp;
              <Icon>{ button.has.icon }</Icon>
            </Fragment>
          )
        } else if (button.has.faIcon) {
          return (
            <Fragment>
              { button.value }
              &nbps;
            </Fragment>
          )
        }
        break

      // icon is located on the left of the button title
      case 'left':
      default:
        if (button.has.icon) {
          return (
            <Fragment>
              <Icon>{ button.has.icon }</Icon>
              &nbsp;
              { button.text }
            </Fragment>
          )
        } else if (button.has.faIcon) {
          return (
            <Fragment>
              &nbsp;
              { button.text }
            </Fragment>
          )
        }

      } // END switch

      return <Fragment>{ button.text }</Fragment>
    } else {
      if (button.has.icon) {
        return <Icon>{ button.has.icon }</Icon>
      } else if (button.has.faIcon) {
        console.error('.faIcon is no longer a valid icon.');
        return ( null );
      }
    }
    return (
      <Fragment>
        No Text!
      </Fragment>
    )
  }; // END ButtonContent

  return (
    <Button
      {...button.props}
      onClick={onClick(redux)}
    >
      <ButtonContent def={button} />
    </Button>
  );
}
