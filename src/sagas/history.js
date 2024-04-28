import moment from "moment";
import _ from "lodash";
import { put, takeLatest, call } from "redux-saga/effects";
import { handleError } from "../utils/error";
import { getToken } from "../utils/token";
import { GET_History } from "../services/history";

function* GET_HistoryEffect({ callback, loading }) {
  try {
    if (loading) loading(true);

    const { Token } = yield call(getToken);
    const { Result } = yield call(GET_History, Token);
    yield put({
      type: "SAVE_History",
      payload: _.map(Result, (i) => {
        return {
          ...i,
          log_time: moment(i.log_time).format("YYYY/MM/DD HH:mm:ss"),
        };
      }),
    });

    if (loading) loading(false);
    if (callback) callback();
  } catch (error) {
    console.error("get history list error:", error);
    if (loading) loading(false);
    yield handleError(error);
  }
}

export default function* Example() {
  yield takeLatest("GET_History", GET_HistoryEffect);
}
