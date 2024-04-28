import _ from "lodash";
import { put, takeLatest, call, retry, delay } from "redux-saga/effects";
import { handleError } from "../utils/error";
import { handleSuccess } from "../utils/success";
import { getToken } from "../utils/token";
import {
  GET_Account,
  POST_Account,
  PUT_Account,
  DELETE_Account,
} from "../services/account";
import { Loaded, Loading } from "../utils/loading";

const convertResultForAccountList = (result) => {
  return _.map(result, (i) => {
    return {
      email: i.email,
      op_id: i.op_id,
      op_name: i.op_name,
      role_id: i.role_id,
      role_name: i.role_name,
    };
  });
};

const AccountList = [
  {
    id: 1,
    name: "harries1",
    account: "harries1",
    email: "abc123@aaa.com",
  },
  {
    id: 2,
    name: "harries2",
    account: "harries2",
    email: "abc555@aaa.com",
  },
  {
    id: 3,
    name: "harries3",
    account: "harries3",
    email: "abc444@aaa.com",
  },
];

function* GET_AccountEffect({ callback, loading }) {
  try {
    yield Loading({
      color: "cyan",
      title: "查詢中",
      message: "正在查詢使用者中，請稍等",
    });
    yield delay(2000);
    yield put({
      type: "SAVE_AllAccount",
      payload: AccountList,
    });
    yield Loaded();
  } catch (error) {
    console.error("get account list error:", error);
    yield Loaded();
    yield handleError(error);
  }
}

function* POST_AccountEffect({ payload, callback, loading }) {
  try {
    yield Loading({
      color: "cyan",
      title: "新增中",
      message: "正在新增使用者中，請稍等",
    });
    yield delay(2000);
    AccountList.push(payload);
    yield put({
      type: "SAVE_AllAccount",
      payload: AccountList,
    });
    yield Loaded();
  } catch (error) {
    console.error("post account error:", error);
    yield Loaded();
    yield handleError(error);
  }
}
function* PUT_AccountEffect({ payload, callback, loading }) {
  try {
    yield Loading({
      color: "cyan",
      title: "新增中",
      message: "正在修改使用者中，請稍等",
    });
    yield delay(2000);
    const edited = _.map(AccountList, (i) => {
      if (i.account === payload.account) {
        return {
          ...payload,
        };
      }
      return { ...i };
    });
    yield put({
      type: "SAVE_AllAccount",
      payload: edited,
    });
    yield Loaded();
  } catch (error) {
    console.error("update account error:", error);
    yield Loaded();
    yield handleError(error);
  }
}
function* DELETE_AccountEffect({ op_id }) {
  try {
    yield Loading({
      color: "red",
      title: "刪除中",
      message: "正在刪除帳號中，請稍等",
    });
    console.log("opid", op_id);
    yield delay(2000);
    const deleted = _.filter(AccountList, (i) => i.account !== op_id);
    yield put({
      type: "SAVE_AllAccount",
      payload: deleted,
    });
    yield Loaded();
  } catch (error) {
    console.error("delete account error:", error);
    yield Loaded();
    yield handleError(error);
  }
}

export default function* Example() {
  yield takeLatest("GET_Account", GET_AccountEffect);
  yield takeLatest("POST_Account", POST_AccountEffect);
  yield takeLatest("PUT_Account", PUT_AccountEffect);
  yield takeLatest("DELETE_Account", DELETE_AccountEffect);
}
