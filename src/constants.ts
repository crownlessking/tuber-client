
// state

export const APP_IS_BOOTSTRAPPED   = 'APP_IS_BOOTSTRAPPED';
export const APP_IS_FETCHING       = 'APP_IS_FETCHING';
export const APP_IS_READY          = 'APP_IS_READY';
export const APP_SWITCHED_PAGE     = 'APP_SWITCHED_PAGE';
export const APP_BROWSER_SWITCHED_PAGE = 'APP_BROWSER_SWITCHED_PAGE';
export const APP_REQUEST_FAILED    = 'APP_REQUEST_FAILED';
export const APP_REQUEST_SUCCESS   = 'APP_REQUEST_SUCCESS';

export const ERRORS_ADD = 'errors/errorsAdd';
export const ERRORS_REMOVE = 'errors/errorsRemove';
export const ERRORS_CLEAR = 'errors/errorsClear';

export const NET_STATE_PATCH = 'NET_STATE_PATCH';
export const STATE_RESET = 'STATE_RESET';

// layouts

export const LAYOUT_CENTERED = 'layout_centered';
export const LAYOUT_CENTERED_NO_SCROLL = 'layout_centered_no_scroll';
export const LAYOUT_MINI_DRAWER_CONTENT = 'layout_mini_drawer_content';
export const LAYOUT_TABLE_VIRTUALIZED = 'layout_table_virtualized';
export const LAYOUT_DEFAULT = 'layout_default';
export const LAYOUT_NONE = 'layout_none';
export const LAYOUT_NONE_NO_APPBAR = 'layout_none_no_appbar';

export const LAYOUT_MD = 'layout_md';
export const LAYOUT_SM = 'layout_sm';
export const LAYOUT_XL = 'layout_xl';
export const LAYOUT_XS = 'layout_xs';

// contents

export const APP_CONTENT_VIEW = '$view';
export const DEFAULT_BLANK_PAGE = 'default-blank';
export const DEFAULT_LANDING_PAGE = 'default-landing';
export const DEFAULT_NOT_FOUND_PAGE = 'default-notfound';

// views

export const DEFAULT_LANDING_PAGE_VIEW = 'default_landing_page_view';
export const DEFAULT_SUCCESS_PAGE_VIEW = 'default_success_page_view';
export const DEFAULT_NOTFOUND_PAGE_VIEW = 'default_notfound_page_view';
export const DEFAULT_ERRORS_PAGE_VIEW = 'default_errors_page_view';
export const DEFAULT_BLANK_PAGE_VIEW = 'default_blank_page_view';

// form items

export const BREAK_LINE = 'br';
export const BOOL_ONOFF = 'bool_onof';
export const BOOL_TRUEFALSE = 'bool_truefalse';
export const BOOL_YESNO = 'bool_yesno';
export const BOX = 'box';
export const STATE_BUTTON = 'state_button';
export const CHECKBOXES = 'checkboxes';
export const DATE_TIME_PICKER = 'date_time_picker';
export const DESKTOP_DATE_PICKER = 'desktop_date_picker';
export const DESKTOP_DATE_TIME_PICKER = 'desktop_date_time_picker';
export const DIV = 'div';
export const A = 'a';
export const FORM = 'form';
export const FORM_CONTROL = 'form_control';
export const FORM_CONTROL_LABEL = 'form_control_label';
export const FORM_GROUP = 'form_group';
export const FORM_HELPER_TEXT = 'form_helper_text';
export const FORM_LABEL = 'form_label';
export const HIGHLIGHT = 'highlight';
export const HORIZONTAL_LINE = 'hr';
export const HTML = 'html';
export const HTML_TAG = 'html_tag';
export const INDETERMINATE = 'indeterminate';
export const STATE_INPUT = 'state_input';
export const INPUT_LABEL = 'input_label';
export const ICON = 'icon';
export const LINK = 'link';
export const LOCALIZED = 'localized';
export const MOBILE_DATE_PICKER  = 'mobile_date_picker';
export const MOBILE_DATE_TIME_PICKER = 'mobile_date_time_picker';
export const NONE = 'none';
export const NUMBER = 'number';
export const PARAGRAPH = 'paragraph';
export const PASSWORD = 'password';
export const PHONE_INPUT = 'phone_input';
export const RADIO_BUTTONS = 'radio_buttons';
export const STATE_SELECT = 'state_select';
export const STATE_SELECT_NATIVE = 'state_select_native';
export const STACK = 'stack';
export const STATIC_DATE_PICKER = 'static_date_picker';
export const SUBMIT = 'submit';
export const SINGLE_SWITCH = 'single_switch';
export const SWITCH = 'switch';
export const TEXT = 'text';
export const TEXTAREA = 'textarea';
export const TEXTFIELD = 'textfield';
export const TEXT_NODE = 'text_node';
export const TIME_PICKER = 'time_picker';
export const DEFAULT = 'default';
export const BAD_FORM_ITEM = '';

// miscellanous

export type TCallback = (e: any) => void;
export const THEME_MODE = 'theme_mode';
export const THEME_DEFAULT_MODE = 'dark';

/** Type for page layout. */
export type TStatePageLayout =
    typeof LAYOUT_CENTERED_NO_SCROLL
  | typeof LAYOUT_CENTERED
  | typeof LAYOUT_DEFAULT
  | typeof LAYOUT_MD
  | typeof LAYOUT_NONE
  | typeof LAYOUT_NONE_NO_APPBAR
  | typeof LAYOUT_SM
  | typeof LAYOUT_TABLE_VIRTUALIZED
  | typeof LAYOUT_XL
  | typeof LAYOUT_XS;

export const DRAWER_DEFAULT_WIDTH = 300;

/**
   * Limits the number of time the app attempts to load a page state from the
   * server if none was defined.
   *
   * **Warning:** This fixes a bug where the app infinitely attempts to load
   * state from server.
   */
export const ALLOWED_ATTEMPTS = 1;

// messages

export const ROOT_DEF_FORBIDDEN = `Access to parent root state is not
  implemented for performance reasons.`;
export const NAME_NOT_SET = 'NAME NOT SET!';
export const LAST_DRAWER_STATE = 'last_drawer_state';
export const NOT_FOUND = -1;
export const NET_STATE_PATCH_DELETE = '<#DEL>';
export const BOOTSTRAP_ATTEMPTS = 'bootstrap_attempts';
