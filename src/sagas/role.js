import _ from "lodash";
import { put, takeLatest, call, delay } from "redux-saga/effects";
import { handleError } from "../utils/error";
import { handleSuccess } from "../utils/success";
import { getToken } from "../utils/token";
import {
  DELETE_Role,
  GET_RoleList,
  POST_Role,
  PUT_Role,
} from "../services/role";

function* GET_RoleListEffect({ callback, loading }) {
  try {
    if (loading) loading(true);

    const { Token } = yield call(getToken);
    const { Result } = yield call(GET_RoleList, Token);
    yield put({
      type: "SAVE_RoleList",
      payload: _.map(Result, (i) => {
        return {
          ...i,
          md_id: _.map(i.md_list, (item) => item.md_id), // 為了讓下拉選單可以顯示做出此array
        };
      }),
    });

    if (loading) loading(false);
    if (callback) callback();
  } catch (error) {
    console.error("get role list error:", error);
    if (loading) loading(false);
    yield handleError(error);
  }
}

function* POST_RoleEffect({ payload, callback, loading }) {
  try {
    yield put({
      type: "SAVE_Message",
      payload: {
        color: "cyan",
        title: "新增中",
        message: "正在新增權限中，請稍等",
        autoClose: false,
        loading: true,
      },
    });
    const { Token } = yield call(getToken);
    yield call(POST_Role, payload, Token);
    yield handleSuccess("新增權限");
    // if (loading) loading(false);
    const { Result } = yield call(GET_RoleList, Token);
    yield put({
      type: "SAVE_RoleList",
      payload: Result,
    });

    yield put({
      type: "CLEAN_Message",
      payload: true,
    });
    if (callback) callback();
  } catch (error) {
    console.error("post role error:", error);
    if (loading) loading(false);
    yield handleError(error);
  }
}

function* PUT_RoleEffect({ payload, callback, loading }) {
  try {
    yield put({
      type: "SAVE_Message",
      payload: {
        color: "cyan",
        title: "更改中",
        message: "正在更改權限中，請稍等",
        autoClose: false,
        loading: true,
      },
    });
    const { Token } = yield call(getToken);
    yield call(PUT_Role, payload, Token);
    yield handleSuccess("更改權限");
    // if (loading) loading(false);
    const { Result } = yield call(GET_RoleList, Token);
    yield put({
      type: "SAVE_RoleList",
      payload: Result,
    });

    yield put({
      type: "CLEAN_Message",
      payload: true,
    });
    if (callback) callback();
  } catch (error) {
    console.error("put role error:", error);
    if (loading) loading(false);
    yield handleError(error);
  }
}

function* DELETE_RoleEffect({ role_id, callback, loading }) {
  try {
    yield put({
      type: "SAVE_Message",
      payload: {
        color: "red",
        title: "刪除中",
        message: "正在刪除權限中，請稍等",
        autoClose: false,
        loading: true,
      },
    });
    const { Token } = yield call(getToken);
    yield call(DELETE_Role, role_id, Token);
    yield handleSuccess("刪除權限");
    // if (loading) loading(false);
    const { Result } = yield call(GET_RoleList, Token);
    yield put({
      type: "SAVE_RoleList",
      payload: Result,
    });

    yield put({
      type: "CLEAN_Message",
      payload: true,
    });
    if (callback) callback();
  } catch (error) {
    console.error("delete role error:", error);
    if (loading) loading(false);
    yield handleError(error);
  }
}

export default function* Example() {
  yield takeLatest("GET_RoleList", GET_RoleListEffect);
  yield takeLatest("POST_Role", POST_RoleEffect);
  yield takeLatest("PUT_Role", PUT_RoleEffect);
  yield takeLatest("DELETE_Role", DELETE_RoleEffect);
}
