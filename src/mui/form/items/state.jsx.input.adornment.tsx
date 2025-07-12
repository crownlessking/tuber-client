import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon, InputAdornment } from '@mui/material';
import { IAdornment } from '../../../common.types';
import { get_font_awesome_icon_prop } from '../../../controllers';

interface IGetTextFieldAdornmentProps {
  startAdornment ?:IAdornment | JSX.Element;
  endAdornment ?:IAdornment | JSX.Element;
  [props: string]: any;
}

const getProps = function (adornment :IAdornment) {
  const props :any = { ...adornment };
  delete props.icon;
  delete props.faIcon;
  delete props.text;

  return props;
}

const getIcon = function (adornment :IAdornment) {
  if (adornment.icon) {
    return <Icon>{ adornment.icon }</Icon>;
  } else if (adornment.faIcon) {
    const icon = get_font_awesome_icon_prop(adornment.faIcon);
    return <FontAwesomeIcon icon={icon as IconProp} />;
  }
  return '';
}

/**
 * Converts the adornment's json definition to a component.
 * 
 * i.e.
 * ```ts
 * const adornment = {
 *   position: 'start' | 'end'
 *   icon?: string
 *   faIcon?: string
 *   text?: string
 *   // ...more props
 * }
 * ```
 * @param adornment 
 * @returns 
 */
export const getAdornment = function (adornment ?:IAdornment) {
  return adornment ? (
    <InputAdornment {...getProps(adornment)}>
      { getIcon(adornment) }
      { adornment.text ? ' '+adornment.text : '' }
    </InputAdornment>
  ) : undefined;
}

/**
 * Allows you to create adornment using json.
 * 
 * Just define your `inputProps` property as the following example and this
 * function will take care of of the rest. i.e.
 *
 * ```tsx
 * const formItem = {
 *   inputProps: {
 *     startAdornment: {
 *       position: 'start' | 'end'
 *       icon?: string
 *       faIcon?: string
 *       text?: string
 *     },
 *    endAdornment: { .... },
 *    // ...(more props)
 *   }
 * }
 * ```
 * @param inputProps 
 * @returns 
 */
export default function getTextFieldAdornment (
  inputProps :IGetTextFieldAdornmentProps
) {
  inputProps.startAdornment = getAdornment(
    inputProps.startAdornment as IAdornment
  );
  inputProps.endAdornment = getAdornment(
    inputProps.endAdornment as IAdornment
  );
  return inputProps;
}
