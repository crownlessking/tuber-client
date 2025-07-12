import { Badge, Icon } from '@mui/material';
import { get_font_awesome_icon_prop } from '../controllers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import getSvgIcon from './state.jsx.imported.svg.icons';
import StateFormItemCustom from '../controllers/StateFormItemCustom';
import { FC, Fragment, useMemo, useCallback } from 'react';

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
export const StateJsxIcon = (({ def: has }) => {
  const renderSvgIcon = useCallback(() => 
    getSvgIcon(has.svgIcon, has.iconProps) || 
    <Icon {...has.iconProps}>{ has.svgIcon }</Icon>
  , [has.svgIcon, has.iconProps]);

  const renderIcon = useCallback(() => 
    getSvgIcon(has.icon, has.iconProps) || 
    <Icon {...has.iconProps}>{ has.icon }</Icon>
  , [has.icon, has.iconProps]);

  const renderFaIcon = useCallback(() => {
    const faProps: any = { size: 'lg', ...has.iconProps };
    const faIcon = get_font_awesome_icon_prop(has.faIcon);
    return <FontAwesomeIcon icon={faIcon} {...faProps} />;
  }, [has.faIcon, has.iconProps]);

  const renderNone = useCallback(() => <Fragment>❌</Fragment>, []);

  const map = useMemo(() => ({
    svgIcon: renderSvgIcon,
    icon: renderIcon,
    faIcon: renderFaIcon,
    none: renderNone
  }), [renderSvgIcon, renderIcon, renderFaIcon, renderNone]);

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

  const iconComponent = useMemo(() => <StateJsxIcon def={has} />, [has]);

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