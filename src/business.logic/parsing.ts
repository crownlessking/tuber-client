import {
  APP_CONTENT_VIEW,
  DEFAULT_LANDING_PAGE_VIEW,
} from '../constants.client';
import { IStatePageContent } from '../interfaces/IStatePage';
import { ler } from './logging';

/**
 * Parses the definition string found in `PageState.content` and
 * `StateDialogForm.content`.
 *
 * Format: "type : name : endpoint : args"
 *
 * **type**: Type of content found on the page.  
 * **name**: Identifier for a a specific content.  
 * **endpoint**: to which data may be sent or retrieve for the page.  
 * **args**: URL arguments when making server request using the enpoint.  
 *
 * @param content 
 * @returns `IStatePageContent` object.
 */
export function get_parsed_content(content?: unknown): IStatePageContent {
  if (typeof content !== 'string') {
    throw new Error('Content is not a string.');
  }
  const options = content.replace(/\s+/g, '').split(':');
  if (options.length <= 1) {
    ler('get_parsed_page_content: Invalid or missing `page` content definition');
    return {
      type: APP_CONTENT_VIEW,
      name: DEFAULT_LANDING_PAGE_VIEW
    };
  }
  const contentObj: IStatePageContent = {
    type: options[0],
    name: options[1]
  };
  if (options.length >= 3) {
    contentObj.endpoint = options[2];
  }
  if (options.length >= 4) {
    contentObj.args = options[3];
  }
  return contentObj;
}
