import { BaseTypes } from '../actions/baseAction';

const initState = {
  toast: {},
};

export default function baseReducer(state = initState, action: any) {
  const { payload } = action;
  switch (action.type) {
    case BaseTypes.SHOW_TOAST_MSG:
      return {
        ...state,
        toast: payload,
      };
    default:
      return state;
  }
}
