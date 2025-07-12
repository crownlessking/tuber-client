import { get_head_meta_content } from '../business.logic';
import { orange } from '@mui/material/colors';
import IState from '../interfaces/IState';

/*
 * WARNING: Be careful what you import in here. It might cause WEBPACK errors.
 */

/**
 * Get global variable value.
 *
 * Since there's a number of global variables that are defined by clients,
 * there's a strong chance that some or all of them may be undefined.
 * This function is a solution to that problem.
 *
 * @param varName string representation of in-code variable identifier.
 * @returns object or throws an exception
 * @throws an exception if the global variable name is invalid.
 */
const _get_global_var = <T=any>(varName: string): T => {
  try {
    return window[varName];
  } catch (e: any) {
    const message = `Global variable "${varName}" does not exist.`;
    console.error(message);
  }
  return { } as T;
}

/** Allows you to rename global variables to prevent conflicts. */
const GLOBAL_PREFIX = get_head_meta_content('web-ui');

/**
 * Default background color  
 * History: `#af74b0`
 */
export const DEFAULT_BACKGROUND_COLOR = '#72A0C1';

/**
 * Raw data obtained from server will be stored in this object as an
 * array.
 * 
 * **procedure**
 * The data is received only once, when the app is loaded. Afterwards,
 * any new data inserted by users will be sent to the server as a
 * request first. Upon a successful POST request (create), the new data
 * will be inserted in the array with `Array.push()` and then displayed.
 * 
 * **dev note**
 * use `Array.push()` to insert data as it arrives or you can create a
 * function to apply rules as to how the data is displayed.
 *
 * Each property in the `data` member represents a separated set of data.
 * For example, you could have a property for reservations along with
 * access logs. e.g.
 *
 * ```javascript
 * 'data': {
 *    'accessLogs': [],
 *    'reservations': [],
 *
 *    // ... (more data sets) e.g.
 *    <data_set_name>: []
 * }
 * ```
 *
 * For example, new access logs are pushed into the array.
 */
export default {

  /**
   * @see info.state.ts
   */
  'app': {
    /** Whether the app can retrieve state from server when not available */
    'fetchingStateAllowed': true,

    /** Whether the app is in debugging mode or not */
    'inDebugMode': false,
    'inDevelMode': false,

    /**
     * The page that is currently displayed.
     *
     * **How it works**
     * When this member is set, to a value, e.g. `login` the app will look for an
     * equivalent `loginPage` property from `pages.state.ts`. If found, the
     * definition from the `loginPage` will be used to apply modifications to the
     * UI, like transitioning from one page to another but without loading anything
     * from the server.
     */
    'route': '',
    'title': 'web-ui',
    'origin': get_head_meta_content('origin') || undefined,

    ..._get_global_var(`${GLOBAL_PREFIX}Info`)
  },

  /**
   * The `meta` member is used to apply rules as to how the data is
   * displayed. e.g.
   *
   * ```javascript
   * 'meta': {
   *    <data_set_name>: {
   *       'title': String, // name of property to be set as data title
   *       'handler': String, // name of component that should be used to display
   *                          // the data
   *
   *        // basically, component configurations will go in here
   *    }
   * }
   * ```
   */
  'meta': {},

  'appbar': {
    'appbarStyle': 'basic',
    'background': {
      'color' : DEFAULT_BACKGROUND_COLOR, // 'radial-gradient(circle, #eeaeca 0%, #94bbe9 100%)'
    },
    'items': [],
    'typography': { },
    ..._get_global_var(`${GLOBAL_PREFIX}Appbar`)
  },

  /**
   * Contains the appbar search field text of all pages. The key is the page name.
   */
  'appbarQueries': {},
  'queryHistory': {},

  /**
   * Application background color
   */
  'background': {
    'color': DEFAULT_BACKGROUND_COLOR, // '#f0f0f0'

    ..._get_global_var(`${GLOBAL_PREFIX}Background`)
  },

  /** Application `font-family` and `color` */
  'typography': {
    // Todo: Insert default values here.

    ..._get_global_var(`${GLOBAL_PREFIX}Typography`)
  },

  'icons': { ..._get_global_var(`${GLOBAL_PREFIX}Icons`)},

  'dialog': {
    'title': 'Dialog Title',
    'label': '',
    'contentText': '',
    'content': '',
    'open': false,
    'actions': []
  },

  /**
   * Object containing all dialog definitions
   * 
   * It can hold dialog definitions for them to be used at the specific time.
   * It is also a way to prevent callback function from being over-inflated
   * with dialog definitions.
   */
  'dialogs': {
    // Todo: Insert default values here.

    ..._get_global_var(`${GLOBAL_PREFIX}Dialogs`)
  },

  'dialogsLight': { ..._get_global_var(`${GLOBAL_PREFIX}DialogsLignt`) },
  'dialogsDark': { ..._get_global_var(`${GLOBAL_PREFIX}DialogsDark`) },

  /**
   * Drawer general state
   *
   * The `drawer` data which can be modified at any time will be stored here.
   * However, icons and functionalities will be defined in the `page` state.
   *
   * This state can contain icons definitions if there is a need for a default
   * set of icons and the bootstrap page should not have any.
   *
   * @see https://material-ui.com/demos/drawers/
   */
  'drawer': {},

  /**
   * Object containing all form definitions
   */
  'forms': {
    // Todo Insert default values here.

    ..._get_global_var(`${GLOBAL_PREFIX}Forms`)
  }, // forms

  'formsLight': {},
  'formsDark': {},

  /**
   * Object containing all page definitions.
   *
   * You can manually insert pages in that object if you wish. However, these
   * pages will be transpiled in the resulting JavaScript.
   */
  'pages': {

    // List of hard coded pages

    // Default blank page
    'default-blank': {
      '_key': 'default-blank',
      'content': '$view : default_blank_page_view',
      'layout': 'layout_centered_no_scroll',
      'typography': { 'color': '#74d2b3' },
      'data': {
        'message': 'Blank page!'
      }
    },

    // Default success feedback page
    'default-success': {
      '_key': 'default-success',
      'content': '$view : default_success_page_view',
      'layout': 'layout_centered_no_scroll',
      'typography': { 'color': '#74d2b3' },
      'data': {
        'message': 'Successful!'
      }
    },

    // Default 404 not found page
    'default-notfound': {
      '_key': 'default-notfound',
      'content': '$view : default_notfound_page_view',
      'layout': 'layout_centered',
      'appbar': { 'items': [{ 'has': { 'text': 'Home', 'route': '/' }}]},
      'data': { 'message': 'Not found!' },
      'background': {
        'type': 'color',
        'value': 'white'
      }
    },

    'default-landing': {
      '_id': '613a6550a5cf801a95fb23c8',
      '_key': 'default-landing',
      'content': '$view : default_landing_page_view',
    },

    'default-test': {
      'content': '$view : default_landing_page_view',
      'appbar': {},
      'drawer': {
        '_type': 'mini'
      }
    },

    'default-errors-view': {
      '_key': 'default-errors-view',
      'content': '$view : default_errors_page_view',
      'background': {
        'type': 'color',
        'value': '#fcfcfc'
      },
      'layout': 'layout_none_no_appbar',
      'appbar': {
        'items': [
          {
            'has': {
              'text': 'Home',
              'route': '/'
            }
          }
        ]
      }
    },

    ..._get_global_var(`${GLOBAL_PREFIX}Pages`)
  }, // pages,

  'pagesLight': {},
  'pagesDark': {},

  /**
   * All resources acquired from the server will be stored in this object. The
   * endpoint would be used as the key through which each dataset would be
   * accessed. This keeps the data organized.
   */
  'data': { ..._get_global_var(`${GLOBAL_PREFIX}Data`)},
  'dataPagesRange': {},

  /**
   * The idea was to throw exceptions if something went wrong, even on a
   * production build. The exception traces and messages would then be saved
   * in this array.
   */
  'errors': [],

  'pagesData': {},
  'chips': {},

  /**
   * After creating a form, when it is displayed, and the user fills it in,
   * the data is saved in this object.
   */
  'formsData': {},
  'formsDataErrors': {},

  /** material-ui snackbar redux store data */
  'snackbar': {},

  'tmp': {},

  /**
   * Contains links related to resources acquired from the server.
   *
   * @see https://jsonapi.org/format/#document-resource-object-links
   */
  'topLevelLinks': {},

  /**
   * For a complete structure of the theme object, visit:
   *
   * @link https://v4.mui.com/customization/default-theme/#default-theme
   */
  'theme': { ...{
    'palette': {
      // 'primary': {
      //   'main': '#318ee8' // '#808000' // olive
      // },
      'secondary': {
        'main': orange[800]
      },
    },
  }, ..._get_global_var(`${GLOBAL_PREFIX}Theme`) },
  'themeLight': {},
  'themeDark': {},

  'net': {},

  /** 
   * Use for making request to a server if a dialog, form, or page state was
   * not found. The app will attempt to load it from the server.
   */
  'pathnames': {
    'dialogs': 'state/dialogs',
    'forms': 'state/forms',
    'pages': 'state/pages',
    ..._get_global_var(`${GLOBAL_PREFIX}Pathnames`)
  },

  /** Use to let the app know where to find your states. */
  'stateRegistry': {},

  /** Bootstrap prefix/key for app initialization */
  'bootstrapPrefix': '',
} as IState;
