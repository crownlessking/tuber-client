import { get_parsed_page_content } from '..'
import { IDialogContentProps } from '../interfaces/IStateDialog'
import { IStatePageContent } from '../interfaces/IStatePage'
import StateDialog from '../StateDialog'
import StateForm from '../StateForm'

/**
 * This is the class for a dialog that displays a form. It is similar to the
 * way a page displays a form. `IStateDialog['content']` has the same format as
 * `IStatePage['content']`. e.g.
 *
 * ```ts
 * const content = '$form : login : users';
 * ```
 *
 * And the dialog should display the form if it is defined in the
 * `appForm` object.
 */
export default class StateDialogForm extends StateDialog {
  get titleProps() {
    return {
      sx: { m: 0, p: 2 },
      ...this.dialogState.titleProps
    }
  }
  private formState?: StateForm
  private contentObj?: IStatePageContent

  /**
   * Same as a page content. i.e.
   *
   * ```ts
   * const content = '$form : login : users';
   * ```
   */
  get content(): string { return this.dialogState.content ?? '' }
  get contentProps(): IDialogContentProps {
    return {
      'sx': { 'paddingTop': '5px !important' },
      ...this.dialogState.contentProps
    }
  }
  private getContentObj(): IStatePageContent {
    return this.contentObj || (
      this.contentObj = get_parsed_page_content(this.content)
    )
  }
  private getForm(): StateForm {
    const form = this.parent.allForms.getForm(this.getContentObj().name)
    form.endpoint = this.getContentObj().endpoint ?? ''
    return form
  }
  get form(): StateForm {
    return this.formState || (this.formState = this.getForm())
  }
}
