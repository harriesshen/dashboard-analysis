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

// 點位分佈
function* POST_ReportEffect({ payload, callback }) {
  try {
    yield Loading({
      color: "cyan",
      title: "查詢中",
      message: "查詢報表資料中",
    });
    const TableList = _.chain(caseJson)

      .groupBy("Town")
      .map((data) => {
        return {
          town_name: data[0].Town,
          event_count: data.length,
          die: _.sumBy(data, "DieNum"),
          hurt: _.sumBy(data, "HurtNum"),
        };
      })
      .orderBy("event_count", "desc")
      .value();

    // console.log("table", TableList);
    // const result = {
    //   TableList,
    // };
    yield delay(2000);
    yield put({ type: "SAVE_Report", payload: TableList });

    if (callback) callback();
    yield Loaded();
  } catch (error) {
    console.error("報表 error:", error);
    if (callback) callback();
    yield Loaded();
    yield handleError(error);
  }
}

export default function* Example() {
  yield takeLatest("POST_Report", POST_ReportEffect);
}
