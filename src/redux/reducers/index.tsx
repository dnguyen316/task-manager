import { combineReducers } from "redux";
import boardReducer from "./boardReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  boardReducer,
  userReducer,
});

export default rootReducer;