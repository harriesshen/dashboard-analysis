import { put } from "redux-saga/effects";

export function* Loading(payload = null) {
  yield put({
    type: "SAVE_Loading",
    payload: true,
  });
  if (payload) {
    const { color, title, message } = payload;
    yield put({
      type: "SAVE_Message",
      payload: {
        color,
        title,
        message,
        autoClose: false,
        loading: true,
      },
    });
  }
}

export function* Loaded() {
  yield put({
    type: "SAVE_Loading",
    payload: false,
  });
  yield put({
    type: "CLEAN_Message",
    payload: true,
  });
}
