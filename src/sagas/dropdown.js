import _ from "lodash";
import { put, takeLatest, call, delay } from "redux-saga/effects";
import axios from "axios";

import { handleError } from "../utils/error";
import { handleSuccess } from "../utils/success";
import { getToken } from "../utils/token";
import { ConvertPort, ConvertToConform } from "../utils/menu";
import { Loaded, Loading } from "../utils/loading";

function* GET_RolesEffect({ callback, loading }) {
  try {
    yield Loading({
      color: "cyan",
      title: "查詢中",
      message: "查詢下拉選單-角色權限資料中",
    });

    const { Token } = yield call(getToken);
    const { Result } = yield axios
      .get(
        `${process.env.REACT_APP_API_PROTOCOL}://${
          process.env.REACT_APP_API_HOST
        }${ConvertPort(5502)}/${ConvertToConform()}/Dropdown/Role`,
        null,
        {
          headers: { Authorization: Token },
        }
      )
      .then((res) => res.data);
    // const { Result } = yield call(GET_Roles, Token);
    yield put({
      type: "SAVE_Roles",
      payload: _.map(Result, (i) => {
        return {
          label: i.role_name,
          value: parseInt(i.role_id, 10),
        };
      }),
    });

    if (callback) callback();
    yield Loaded();
  } catch (error) {
    console.error("get roles error", error);
    yield Loaded();
    yield handleError(error);
  }
}

function* GET_ModulesEffect({ callback, loading }) {
  try {
    yield Loading({
      color: "cyan",
      title: "查詢中",
      message: "查詢下拉選單-功能權限資料中",
    });

    const { Token } = yield call(getToken);
    const { Result } = yield axios
      .get(
        `${process.env.REACT_APP_API_PROTOCOL}://${
          process.env.REACT_APP_API_HOST
        }${ConvertPort(5502)}/${ConvertToConform()}/Dropdown/Module`,
        null,
        {
          headers: { Authorization: Token },
        }
      )
      .then((res) => res.data);
    // const { Result } = yield call(GET_Modules, Token);
    yield put({
      type: "SAVE_Modules",
      payload: _.map(Result, (i) => {
        return {
          label: i.md_name,
          value: i.md_id,
        };
      }),
    });
    if (callback) callback();
    yield Loaded();
  } catch (error) {
    console.error("get modules error", error);
    yield Loaded();
    yield handleError(error);
  }
}

const town = [
  { town_id: 10004010, town_name: "竹北市", latlng: [24.8396, 121.0229] },
  { town_id: 10004020, town_name: "竹東鎮", latlng: [24.7445, 121.0864] },
  { town_id: 10004030, town_name: "新埔鎮", latlng: [24.8417, 121.0772] },
  { town_id: 10004040, town_name: "關西鎮", latlng: [24.7871, 121.1793] },
  { town_id: 10004050, town_name: "湖口鄉", latlng: [24.9005, 121.0492] },
  { town_id: 10004060, town_name: "新豐鄉", latlng: [24.8998, 120.9962] },
  { town_id: 10004070, town_name: "芎林鄉", latlng: [24.7622, 121.1004] },
  { town_id: 10004080, town_name: "橫山鄉", latlng: [24.7088, 121.1673] },
  { town_id: 10004090, town_name: "北埔鄉", latlng: [24.7006, 121.0681] },
  { town_id: 10004100, town_name: "寶山鄉", latlng: [24.7261, 120.9964] },
  { town_id: 10004110, town_name: "峨眉鄉", latlng: [24.6861, 121.0187] },
  { town_id: 10004120, town_name: "尖石鄉", latlng: [24.5864, 121.2841] },
  { town_id: 10004130, town_name: "五峰鄉", latlng: [24.5899, 121.1386] },
];

function* GET_AccidentDistributionDropdownEffect({ payload }) {
  try {
    yield Loading({
      color: "cyan",
      title: "查詢中",
      message: "查詢下拉選單中",
    });
    town.push({ town_id: 0, town_name: "全部" });
    // #region 城鎮下拉
    yield put({
      type: "SAVE_Town",
      payload: _.map(town, (i) => {
        return { label: i.town_name, value: i.town_name };
      }),
    });
    // #endregion

    // #region 年分下拉
    yield put({
      type: "SAVE_Year",
      payload: [109, 110, 111, 112],
    });
    // #endregion

    // if (callback) callback(response.Result);
    yield Loaded();
  } catch (error) {
    console.error("AccidentDistribution Dropdown error:", error);
    yield Loaded();
    yield handleError(error);
  }
}

function* GET_YearDropdownEffect({ payload }) {
  try {
    yield Loading({
      color: "cyan",
      title: "查詢中",
      message: "查詢下拉選單中",
    });
    // #region 年分下拉
    yield put({
      type: "SAVE_Year",
      payload: [109, 110, 111, 112],
    });
    // #endregion

    // if (callback) callback(response.Result);
    yield Loaded();
  } catch (error) {
    console.error("AccidentDistribution Dropdown error:", error);
    yield Loaded();
    yield handleError(error);
  }
}

export default function* Example() {
  yield takeLatest("GET_Roles", GET_RolesEffect);
  yield takeLatest("GET_Modules", GET_ModulesEffect);
  yield takeLatest(
    "GET_AccidentDistributionDropdown",
    GET_AccidentDistributionDropdownEffect
  );

  yield takeLatest("GET_YearDropdown", GET_YearDropdownEffect);
}
