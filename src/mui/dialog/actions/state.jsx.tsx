import { Fragment } from 'react';
import IStateFormItem from '../../../interfaces/IStateFormItem';
import StateDialog from '../../../controllers/StateDialog';
import StateFormItem from '../../../controllers/StateFormItem';
import { STATE_BUTTON } from '../../../constants';
import StateJsxDialogActionButton from './state.jsx.button';

interface IFieldItemProps {
  def: IStateFormItem[];
  parent: StateDialog;
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
