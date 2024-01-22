import { DECREMENT, INCREMENT } from "./actionsTypes";

const intialState = {
  count: 0,
};

export const reducer = (state = intialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        count: state.count + 1,
      };
    case DECREMENT:
      return {
        ...state,
        count: state.count - 1,
      };
    default:
      return state;
  }
};
