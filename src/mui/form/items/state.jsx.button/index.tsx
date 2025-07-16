import { Fragment } from 'react';
import { Icon, Button } from '@mui/material';
import store, { actions } from '../../../../state';
import StateFormItem from '../../../../controllers/StateFormItem';
import { get_button_content_code, TCombinations } from './_button.common.logic';

interface IJsonButtonProps { def: StateFormItem; }

type TMapIcon = {
  [K in TCombinations]: () => JSX.Element | null;
}

export default function StateJsxButton ({ def: button }: IJsonButtonProps) {
  const redux = {
    store,
    actions,
    route: button.props.href
  };
  const onClick = button.onClick || button.has.callback;

  const map: TMapIcon = {
    textrighticon: () => (
      <Fragment>
        { button.text }
        &nbsp;
        <Icon>{ button.has.icon }</Icon>
      </Fragment>
    ),
    textrightfaicon: () => (
      <Fragment>
        { button.text }
        &nbsp;
      </Fragment>
    ),
    textlefticon: () => (
      <Fragment>
        <Icon>{ button.has.icon }</Icon>
        &nbsp;
        { button.text }
      </Fragment>
    ),
    textleftfaicon: () => (
      <Fragment>
        &nbsp;
        { button.text }
      </Fragment>
    ),
    icon: () => <Icon>{ button.has.icon }</Icon>,
    faicon: () => ( null ),
    text: () => <Fragment>{ button.text }</Fragment>,
    none: () => <Fragment>❌ No Text!</Fragment>
  }
  const code = get_button_content_code(button);
  return (
    <Button
      {...button.props}
      onClick={onClick(redux)}
    >
      { map[code]() }
    </Button>
  );
}