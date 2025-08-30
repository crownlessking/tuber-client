import { NET_STATE_PATCH, STATE_RESET } from '../constants.client';

export const net_patch_state = (stateFragment: unknown) => ({
  type: NET_STATE_PATCH,
  payload: stateFragment
});

export const state_reset = () => ({
  type: STATE_RESET
});
