import Chip from '@mui/material/Chip';
import { useDispatch, useSelector } from 'react-redux';
import store, { AppDispatch, RootState, actions, IRedux } from '../../state';
import StateFormItemCustomChip from '../../controllers/templates/StateFormItemCustomChip';

interface IStateJsxChipProps {
  def: StateFormItemCustomChip<any>[];
}

export default function StateJsxChip ({ def: chips }: IStateJsxChipProps) {
  const dispatch = useDispatch<AppDispatch>();
  const route = useSelector(
    (rootState: RootState) => rootState.app.route ?? ''
  );
  const chipsState = useSelector((rootState: RootState) => rootState.chips);
  const routeChipsState = chipsState[route];
  const redux = { store, dispatch, actions, route } as IRedux;

  const fixedChips = chips.map(chip => {
    const cState = routeChipsState[chip.id];
    return new StateFormItemCustomChip({
      ...chip,
      ...cState,
    }, {});
  });

  return (
    <>
      {fixedChips.map((chip, i) => (
        <Chip
          {...chip.props}
          key={`appbar-midsearch-input-chip-${i}`}
          label={chip.label}
          variant={chip.variant}
          color={chip.color}
          onClick={chip.onClick(redux)}
          onDelete={chip.onDelete(redux)}
        />
      ))}
    </>
  );

}