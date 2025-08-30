import React from 'react';
import { Icon, Button } from '@mui/material';
import store, { actions } from '../../../../state';
import type StateFormItem from '../../../../controllers/StateFormItem';
import { get_button_content_code, TCombinations } from './_button.common.logic';

interface IJsonButtonProps { def: StateFormItem; }

type TMapIcon = {
  [K in TCombinations]: () => React.JSX.Element | null;
}

export default function StateJsxButton ({ def: button }: IJsonButtonProps) {
  const map: TMapIcon = {
    textrighticon: () => (
      <>
        { button.text }
        &nbsp;
        <Icon>{ button.has.icon }</Icon>
      </>
    ),
    textrightfaicon: () => (
      <>
        { button.text }
        &nbsp;
      </>
    ),
    textlefticon: () => (
      <>
        <Icon>{ button.has.icon }</Icon>
        &nbsp;
        { button.text }
      </>
    ),
    textleftfaicon: () => (
      <>
        &nbsp;
        { button.text }
      </>
    ),
    icon: () => <Icon>{ button.has.icon }</Icon>,
    faicon: () => null,
    text: () => <>{ button.text }</>,
    none: () => <>❌ No Text!</>
  }
  const redux = {
    store,
    actions,
    route: button.props.href
  };
  const onClick = button.onClick || button.has.callback;
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