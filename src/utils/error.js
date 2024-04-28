/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable require-yield */
import _ from "lodash";
import { put } from "redux-saga/effects";

export function* handleError(error) {
  const status = _.get(error, "response.status");
  const errorMessage = _.get(error, "response.data.message");
  if (status) {
    switch (status) {
      case 401:
        yield put({
          type: "SAVE_Message",
          payload: {
            color: "red",
            title: "發生錯誤！",
            message: errorMessage ? (errorMessage) : ("權限不足!"),
          },
        });
        yield put({ type: "Logout" });
        break;
      case 404:
        yield put({
          type: "SAVE_Message",
          payload: {
            color: "red",
            title: "發生錯誤！",
            message: errorMessage ? (errorMessage) : ("查無資料！"),
          },
        });
        break;
      default:
        yield put({
          type: "SAVE_Message",
          payload: {
            color: "red",
            title: "發生錯誤！",
            message: errorMessage ? (errorMessage) : ("發生未知錯誤，請稍後再試！"),
          },
        });
        break;
    }
  } else {
    yield put({
      type: "SAVE_Message",
      payload: {
        color: "red",
        title: "發生錯誤！",
        message: "發生未知錯誤，請稍後再試！",
      },
    });
  }
}
