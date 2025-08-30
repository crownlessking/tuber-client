import { PaperProps } from '@mui/material';
import IAbstractState from './IAbstractState';
import IStateFormItem from './IStateFormItem';

/**
 * Form with a list of fields and optional background. e.g.
 * ```ts
 * const state = {
 *    'forms': {
 *      '<name>Form': { // replace <name> with your form name.
 *        'items': []
 *      }
 *    }
 * }
 * ```
 */
export default interface IStateForm extends IAbstractState {
  /** Switch layout effects */
  _type?: 'stack' | 'box' | 'form' | 'selection' | 'alert' | 'none' | 'any';
  /** List of field states. e.g. textfield, select, radio... etc. */
  items?: IStateFormItem[];
  /** Spread me on a Paper component. */
  paperProps?: PaperProps;
  /** Whether the generated form should have a paper background or not. */
  paperBackground?: boolean;
  errorCount?: number;
}
