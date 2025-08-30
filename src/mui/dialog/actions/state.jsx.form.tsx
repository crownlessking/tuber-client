import { Fragment } from 'react';
import { STATE_BUTTON } from '../../../constants.client';
import type StateForm from 'src/controllers/StateForm';
import IStateFormItem from '../../../interfaces/IStateFormItem';
import StateFormItem from '../../../controllers/StateFormItem';
import StateJsxDialogActionButton from './state.jsx.form.button';

interface IFieldItemProps {
  def: IStateFormItem[];
  parent: StateForm;
}

export default function StateJsxDialogAction({
  def: formItems,
  parent
}: IFieldItemProps) {
  return (
    <Fragment>
      {formItems.map((state, i) => {
        if (state.type?.toLowerCase() !== STATE_BUTTON) { return ( null ) }
        const item = new StateFormItem(state, parent)
        return <StateJsxDialogActionButton def={item} key={`dialgo-action-${i}`} />
      })}
    </Fragment>
  );
}
