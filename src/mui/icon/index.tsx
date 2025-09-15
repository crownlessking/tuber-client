import { Badge, Icon, SvgIcon } from '@mui/material';
import getSvgIcon from '../state.jsx.imported.svg.icons';
import {type StateFormItemCustom, StateAllIcons } from '../../controllers';
import { FC, Fragment, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from 'src/state';
import StateJsxSvgIcon from './state.jsx.svg.icon';

interface IJsonIconProps {
  def: StateFormItemCustom<unknown>; // StateFormItem | StateLink
}

export interface IStateJsxIconProps {
  name: string;
  config?:  React.ComponentProps<typeof SvgIcon>;
}

/**
 * e.g.
 * ```ts
 * const item = {
 *    has: {
 *       icon: '',
 *       faIcon: ''
 *    }
 * }
 * ```
 */
export const StateJsxUnifiedIconProvider = (({ def: has }) => {
  const iconsState = useSelector((state: RootState) => state.icons);

  const renderIcon = useCallback(() => {
    const allIcons = new StateAllIcons(iconsState);
    const svg = allIcons.getIcon(has.icon);
    return <StateJsxSvgIcon def={has} svgDef={svg} />;
  }, [iconsState, has]);

  const renderSvgIcon = useCallback(() =>
    getSvgIcon(has.svgIcon, has.iconProps) ||
    <Icon {...has.iconProps}>{ has.svgIcon }</Icon>
  , [has.svgIcon, has.iconProps]);

  const renderMuiIcon = useCallback(() => 
    getSvgIcon(has.muiIcon, has.iconProps) || 
    <Icon {...has.iconProps}>{ has.muiIcon }</Icon>
  , [has.muiIcon, has.iconProps]);

  const renderFaIcon = useCallback(() => {
    console.error('.faIcon is no longer a valid icon.');
    return ( null );
  }, []);

  const renderNone = useCallback(() => <Fragment>❌</Fragment>, []);

  const map = useMemo(() => ({
    icon: renderIcon,
    svgIcon: renderSvgIcon,
    muiIcon: renderMuiIcon,
    faIcon: renderFaIcon,
    none: renderNone
  }), [renderIcon, renderSvgIcon, renderMuiIcon, renderFaIcon, renderNone]);

  const type = useMemo(() => {
    if (has.svgIcon && has.svgIcon !== 'none') return 'svgIcon';
    if (has.icon) return 'icon';
    if (has.faIcon) return 'faIcon';
    return 'none';
  }, [has.svgIcon, has.icon, has.faIcon]);

  return map[type]();
}) as FC<IJsonIconProps>;

export const StateJsxIcon: FC<IStateJsxIconProps> = ({ name, config }) => {
  const iconsState = useSelector((state: RootState) => state.icons);
  const allIcons = new StateAllIcons(iconsState);
  const iconSvg = allIcons.getIcon(name);

  return (
    <StateJsxSvgIcon def={{ svgIconProps: config || {} }} svgDef={iconSvg} />
  );
};

export const StateJsxBadgedIcon = (({ def: has }) => {
  const badgeProps = useMemo(() => ({
    color: 'error' as const,
    ...has.badge,
    badgeContent: '-'
  }), [has.badge]);

  const iconComponent = useMemo(() => <StateJsxUnifiedIconProvider def={has} />, [has]);

  return (
    <Fragment>
      {has.badge ? (
        <Badge {...badgeProps}>
          {iconComponent}
        </Badge>
      ) : (
        iconComponent
      )}
    </Fragment>
  );
}) as FC<IJsonIconProps>;

export default StateJsxBadgedIcon;