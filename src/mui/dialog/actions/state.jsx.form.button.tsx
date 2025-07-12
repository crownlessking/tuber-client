import { Fragment } from 'react';
import { Icon, Button } from '@mui/material';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StateFormItem from 'src/controllers/StateFormItem';
import store, { actions } from 'src/state';
import { get_font_awesome_icon_prop } from 'src/controllers';
import StateForm from 'src/controllers/StateForm';

interface IJsonButtonProps { def: StateFormItem<StateForm>; }
interface IJsonButtonContentProps {
  def: StateFormItem<StateForm>;
}

export default function StateJsxDialogAction ({ def: button }: IJsonButtonProps) {
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
          );
        } else if (button.has.faIcon) {
          const icon = get_font_awesome_icon_prop(button.has.faIcon) as IconProp
          return (
            <Fragment>
              { button.value }
              &nbps;
              <FontAwesomeIcon icon={icon} />
            </Fragment>
          );
        }
        break;

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
          );
        } else if (button.has.faIcon) {
          const icon = get_font_awesome_icon_prop(button.has.faIcon) as IconProp
          return (
            <Fragment>
              <FontAwesomeIcon icon={icon} />
              &nbsp;
              { button.text }
            </Fragment>
          );
        }

      } // END switch

      return <Fragment>{ button.text }</Fragment>;
    } else {
      if (button.has.icon) {
        return <Icon>{ button.has.icon }</Icon>;
      } else if (button.has.faIcon) {
        const icon = get_font_awesome_icon_prop(button.has.faIcon) as IconProp;
        return <FontAwesomeIcon icon={icon} />;
      }
    }
    return (
      <Fragment>
        No Text!
      </Fragment>
    );
  }; // END ButtonContent

  return (
    <Button
      {...button.props}
      onClick={onClick(redux)}
      disabled={button.disableOnAll}
    >
      <ButtonContent def={button} />
    </Button>
  );
}
