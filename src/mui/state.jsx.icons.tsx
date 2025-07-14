import { Badge, Icon } from '@mui/material';
import { get_font_awesome_icon_prop } from '../controllers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import getSvgIcon from './state.jsx.imported.svg.icons';
import StateFormItemCustom from '../controllers/StateFormItemCustom';
import { FC, Fragment, useMemo, useCallback } from 'react';
import StateAllIcons from 'src/controllers/StateAllIcons';
import { useSelector } from 'react-redux';
import { RootState } from 'src/state';
import StateJsxIcon from './icon';

interface IJsonIconProps {
  def: StateFormItemCustom<any>; // StateFormItem | StateLink
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
export const JsxUnifiedIconProvider = (({ def: has }) => {
  const iconsState = useSelector((state: RootState) => state.icons);

  const renderIcon = useCallback(() => {
    const allIcons = new StateAllIcons(iconsState);
    const svg = allIcons.getIcon(has.icon);
    return <StateJsxIcon def={has} svgDef={svg} />;
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
    const faProps: any = { size: 'lg', ...has.iconProps };
    const faIcon = get_font_awesome_icon_prop(has.faIcon);
    return <FontAwesomeIcon icon={faIcon} {...faProps} />;
  }, [has.faIcon, has.iconProps]);

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

export const StateJsxBadgedIcon = (({ def: has }) => {
  const badgeProps = useMemo(() => ({
    color: 'error' as const,
    ...has.badge,
    badgeContent: '-'
  }), [has.badge]);

  const iconComponent = useMemo(() => <JsxUnifiedIconProvider def={has} />, [has]);

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