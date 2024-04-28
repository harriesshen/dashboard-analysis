import _ from "lodash";
import { put, takeLatest, call, all, delay } from "redux-saga/effects";
import { handleError } from "../utils/error";
import { handleSuccess } from "../utils/success";
// import { getToken } from "../utils/token";

// import {
//   POST_District,
//   POST_DistrictExport,
//   POST_Point,
//   POST_PointDetail,
//   POST_PointExport,
// } from "../services/AccidentAnalysis";
import { Loaded, Loading } from "../utils/loading";
// import { base64Download } from "../utils/base64download";
import caseJson from "./Hsinchu.json";

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
// 點位分佈
function* POST_DistrictEffect({ payload, callback }) {
  try {
    yield Loading({
      color: "cyan",
      title: "查詢中",
      message: "查詢事故資料中",
    });
    const TableList = _.chain(caseJson)
      .filter((i) =>
        payload.town_id[0] === "全部" ? true : payload.town_id.includes(i.Town)
      )
      .groupBy("Town")
      .map((data) => {
        return {
          town_name: data[0].Town,
          event_count: data.length,
          die: _.sumBy(data, "DieNum"),
          hurt: _.sumBy(data, "HurtNum"),
          latlng: _.find(town, (i) => i.town_name === data[0].Town).latlng,
        };
      })
      .orderBy("event_count", "desc")
      .value();

    console.log("table", TableList);
    const result = {
      DetailList:
        payload.town_id[0] === "全部"
          ? caseJson
          : _.filter(caseJson, (i) => payload.town_id.includes(i.Town)),
      TableList,
    };
    yield delay(2000);
    yield put({ type: "SAVE_District", payload: result });

    if (callback) callback();
    yield Loaded();
  } catch (error) {
    console.error("事故分布分析 error:", error);
    if (callback) callback();
    yield Loaded();
    yield handleError(error);
  }
}

export default function* Example() {
  yield takeLatest("POST_District", POST_DistrictEffect);
}
