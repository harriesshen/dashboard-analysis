import { combineReducers } from "redux";

import global from "./global";
import role from "./role";
import dropdown from "./dropdown";
import account from "./account";
import history from "./history";
import accidentAnalysis from "./accidentAnalysis";
import report from "./report";

export default combineReducers({
  global,
  role,
  dropdown,
  account,
  history,
  accidentAnalysis,
  report,
});
