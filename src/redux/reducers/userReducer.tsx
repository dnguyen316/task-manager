import { UserTypes } from "redux/actions/userAction";

const defaultState = {
  isLoading: false,
  user: {},
  isAuthenticated: false,
}

const userReducer = (state = defaultState, action: typeof UserTypes) => {
  const { isLoading, user } = action;
  
  switch(action.type) {
    case UserTypes.LOGIN:
      return {
        ...state,
        isLoading,
      }
    case UserTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user,
        isAuthenticated: true,
      }
    case UserTypes.REGISTER:
      return {
        ...state,
        isLoading
      }
    case UserTypes.REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case UserTypes.SIGN_OUT:
      return {
        ...state,
        user: {},
        isAuthenticated: false,
      }
    }
    return state;
};

export default userReducer;