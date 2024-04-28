import qs from "qs";
import axios from "axios";
import _ from "lodash";
import { put, takeLatest, select, call } from "redux-saga/effects";
import { handleError } from "../utils/error";
import history from "../utils/history";
import request from "../utils/request";
import { getToken } from "../utils/token";

import config from "../config";
import { ConvertPort, ConvertToConform } from "../utils/menu";

function* INITIAL_Toast({ payload }) {
  yield put({ type: "SAVE_Toast", payload });
}

function* PUSH_GoToRoute({ path, payload, callback }) {
  const body = { pathname: path, search: qs.stringify(payload) };
  // console.log(body)
  yield history.push(body);
  if (callback) callback();
}

function* GoOtherWindow({ path, callback }) {
  yield (window.location.href = path);
  if (callback) callback();
}

function* GET_UserPid({ payload, callback }) {
  try {
    const { Token } = getToken();
    const response = yield request.get("/F01/F0101/UserProcess", payload, {
      headers: { Authorization: Token },
    });

    yield put({ type: "SAVE_UserPid", payload: response.Result[0].UserPid });

    if (callback) callback();
  } catch (error) {
    yield handleError(error);
  }
}

function* CHANGE_WindowScreenSize({ payload: windowSize }) {
  const tabletWidth = 1350;
  const mobileWidth = 992;

  const isTablet = yield select((state) => state.global.isTablet);
  const isMobile = yield select((state) => state.global.isMobile);

  if (windowSize <= mobileWidth && isMobile !== true)
    yield put({ type: "SAVE_isMobile", payload: true });

  if (windowSize <= tabletWidth && isTablet !== true)
    yield put({ type: "SAVE_isTablet", payload: true });

  if (windowSize > mobileWidth && isMobile !== false)
    yield put({ type: "SAVE_isMobile", payload: false });

  if (windowSize > tabletWidth && isTablet !== false)
    yield put({ type: "SAVE_isTablet", payload: false });
}

function* GET_MarqueeEffect({ payload, callback }) {
  try {
    const { Token } = getToken();
    const response = yield request.get(
      `${process.env.REACT_APP_API_PROTOCOL}://${
        process.env.REACT_APP_API_HOST
      }${ConvertPort(5502)}/${ConvertToConform()}/FrameFunction/Marquee`,
      payload,
      {
        headers: { Authorization: Token },
      }
    );

    yield put({ type: "SAVE_Marquee", payload: response.Result });

    if (callback) callback();
  } catch (error) {
    yield handleError(error);
  }
}

function* GET_FrontendStyleEffect() {
  try {
    const { Result } = yield axios
      .get(
        `${process.env.REACT_APP_API_PROTOCOL}://${
          process.env.REACT_APP_API_HOST
        }${ConvertPort(5502)}/${ConvertToConform()}/FrameFunction/FrontendStyle`
      )
      .then((res) => res.data);

    const title = _.filter(Result, (r) => r.key === "title")[0];
    const backgroundColor = _.filter(
      Result,
      (r) => r.key === "backgroundColor"
    )[0];
    const logo = _.filter(Result, (r) => r.key === "logo")[0];
    const menuPosition = _.filter(Result, (r) => r.key === "menuPosition")[0];

    yield put({ type: "SAVE_Title", payload: title.value });
    yield put({ type: "SAVE_BackgroundColor", payload: backgroundColor.value });
    yield put({ type: "SAVE_Logo", payload: logo.value });
    yield put({ type: "SAVE_MenuPosition", payload: menuPosition.value });
  } catch (error) {
    console.error("FrontendStyle Error", error);
    yield handleError(error);
  }
}

export default function* Example() {
  yield takeLatest("INITIAL_Toast", INITIAL_Toast);
  yield takeLatest("PUSH_GoToRoute", PUSH_GoToRoute);
  yield takeLatest("GoOtherWindow", GoOtherWindow);
  yield takeLatest("GET_UserPid", GET_UserPid);
  yield takeLatest("CHANGE_WindowScreenSize", CHANGE_WindowScreenSize);
  yield takeLatest("GET_Marquee", GET_MarqueeEffect);
  yield takeLatest("GET_FrontendStyle", GET_FrontendStyleEffect);
}
