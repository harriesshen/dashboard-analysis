import _ from "lodash";
import { put, takeLatest, call, all } from "redux-saga/effects";
import { handleError } from "../utils/error";
import { handleSuccess } from "../utils/success";
import { setToken, removeToken, getToken } from "../utils/token";
import {
  POST_Login,
  GET_ForgotPassword,
  UPDATE_UserPassword,
  UPDATE_UserInfo,
  GET_UserID,
} from "../services/auth";
import config from "../config";
import history from "../utils/history";

const domain = config.domain;

function* POST_LoginEffect({ payload, callback, loading }) {
  try {
    if (loading) loading(true);
    const { Result } = yield call(POST_Login, payload);
    yield call(setToken, Result);
    if (loading) loading(false);
    if (callback) callback();
  } catch (error) {
    console.error("login error:", error);
    if (loading) loading(false);
    yield handleError(error);
  }
}

function* GET_ForgotPasswordEffect({ payload, callback, loading }) {
  try {
    if (loading) loading(true);

    const { Result } = yield call(GET_ForgotPassword, payload);

    if (loading) loading(false);
    if (callback) callback(Result);
  } catch (error) {
    if (callback) callback(_.get(error, "response.data"));
    if (loading) loading(false);
    yield handleError(error);
  }
}

function* Logout() {
  try {
    yield history.push("/auth/login");
  } catch (error) {
    console.log(error);
  }
}

function* UPDATE_UserInfoEffect({ payload, callback, loading }) {
  try {
    if (loading) loading(true);

    const { Token } = yield call(getToken);
    yield call(UPDATE_UserInfo, payload, Token);

    if (loading) loading(false);
    if (callback) callback();
  } catch (error) {
    console.log(error);
    if (loading) loading(false);
    yield handleError(error);
  }
}

function* UPDATE_UserPasswordEffect({ payload, callback, loading }) {
  try {
    if (loading) loading(true);

    const { Token } = yield call(getToken);
    yield call(UPDATE_UserPassword, payload, Token);

    if (loading) loading(false);
    if (callback) callback();
  } catch (error) {
    console.log(error);
    if (loading) loading(false);
    yield handleError(error);
  }
}
function* GET_UserIDEffect({ payload, callback, loading }) {
  try {
    if (loading) loading(true);

    const { Token } = yield call(getToken);
    const { Result } = yield call(GET_UserID, payload, Token);

    if (loading) loading(false);
    if (callback) callback();
  } catch (error) {
    console.log(error);
    if (loading) loading(false);
    yield handleError(error);
  }
}

export default function* Example() {
  yield takeLatest("POST_Login", POST_LoginEffect);
  yield takeLatest("GET_ForgotPassword", GET_ForgotPasswordEffect);
  yield takeLatest("Logout", Logout);
  yield takeLatest("UPDATE_UserPassword", UPDATE_UserPasswordEffect);
  yield takeLatest("UPDATE_UserInfo", UPDATE_UserInfoEffect);
  yield takeLatest("GET_UserID", GET_UserIDEffect);
}
