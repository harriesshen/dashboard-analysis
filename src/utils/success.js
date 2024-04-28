/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable require-yield */
import _ from "lodash";
import { put } from "redux-saga/effects";

export function* handleSuccess(value) {
  yield put({
    type: "SAVE_Message",
    payload: {
      color: "green",
      title: "成功！",
      message: `${value}成功`,
    },
  });
}
