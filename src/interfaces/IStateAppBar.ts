import { 
  AppBarProps as AppbarProps, ToolbarProps, IconButtonProps, BoxProps, InputBaseProps,
} from '@mui/material';
import { IAbstractState } from '../common.types';
import { IHtmlAttributes } from '.';
import IStateBackground from './IStateBackground';
import IStateComponent from './IStateComponent';
import IStateFormItemCustom from './IStateFormItemCustom';
import IStateLink from './IStateLink';
import IStateTypography from './IStateTypography';

export type TAppbarStyle = 'basic' | 'mini' | 'responsive' | 'middle_search' | 'none';

export default interface IStateAppbar extends IAbstractState {
  _type?: TAppbarStyle;
  /** App bar style from Material-ui example's website. */
  appbarStyle?: TAppbarStyle;
  /** mui5 logo tag. i.e. "img" */
  logoTag?: keyof JSX.IntrinsicElements;
  /** app bar component props */
  props?: AppbarProps;
  /** toolbar component props */
  toolbarProps?: ToolbarProps;
  /** hamburger icon props */
  menuIconProps?: IconButtonProps;
  logoProps?: IHtmlAttributes;
  /** mui5 text-logo props */
  textLogoProps?: any;
  logoContainerProps?: IHtmlAttributes;
  /** Appbar textfield props */
  inputBaseProps?: InputBaseProps;
  /** Appbar input chips */
  inputBaseChips?: IStateFormItemCustom[];
  /** Appbar search field props */
  searchFieldProps?: any;
  /** Icon that's in the left corner of app bar search field. */
  searchFieldIcon?: IStateFormItemCustom;
  /** Whether to hide the search field icon. */
  hideSearchFieldIcon?: boolean;
  /** Icon button that's in the right corner of app bar search field. */
  searchFieldIconButton?: IStateLink;
  searchFieldIconButtonProps?: any;
  // searchFieldIconButtonOnClickHandle?: string
  /** (Desktop) props for box grouping the menu link */
  desktopMenuItemsProps?: BoxProps;
  desktopMenuItems2Props?: BoxProps;
  /** (Mobile) props for box grouping the menu link */
  mobileMenuItemsProps?: BoxProps;
  mobileMenuItems2Props?: BoxProps;
  /** when web page is in mobile view, this icon will show */
  mobileMenuIconProps?: IconButtonProps;
  mobileMenuIcon2Props?: IconButtonProps;
  /** each individual items */
  mobileMenuProps?: any;
  /** each individual items */
  mobileMenu2Props?: any;
  /** props applied to all menu items */
  menuItemsProps?: any;
  /** style to be applied to all menu items */
  menuItemsSx?: any;
  /** mobile menu id */
  menuId?: string;
  mobileMenuId?: string;
  /** mobile menu 2 id */
  mobileMenu2Id?: string;
  /** mui5 logo wrapper styles */
  logoTheme?: any;
  /** Appbar background color, image, gradient... etc. */
  background?: IStateBackground;
  /** Appbar font color and family. */
  typography?: IStateTypography;
  /** Appbar icons and links. */
  items?: IStateLink[];
  items2?: IStateLink[];
  /**
   * If `true`, the background of the app bar defined at the root state
   * (`IState`) will be used.
   */
  useDefaultBackground?: boolean;
  /** The route of the page with a valid app bar background. */
  backgroundInherited?: string;
  /**
   * If `true`, the typography of the appbar defined at the root state
   * (`IState`) will be used.
   */
  useDefaultTypography?: boolean;
  /** The route of the page with a valid appbar typography. */
  typographyInherited?: string;
  /**
   * There are times when the available options are not enough.
   * With this function, you can insert JSON defined components
   * into an existing component to customize it even further.
   */
  components?: {
    [comp: string]: IStateComponent[];
  };
}
