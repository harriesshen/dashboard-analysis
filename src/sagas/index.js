import { all } from "redux-saga/effects";
import _ from "lodash";

const sagas = [
  "global",
  "auth",
  "account",
  "role",
  "dropdown",
  "history",
  "accidentAnalysis",
  "report",
];
// const defaultSaga = [require(`./global`).default()];
// const SystemSaga = _.map(["auth", "system"], (item) => require(`../module/System/src/sagas/${item}`).default());

const Saga = sagas.map((saga) => require(`./${saga}`).default());
// const Saga = _.concat(defaultSaga, SystemSaga, AccidentanalysisSaga);
export default function* rootSaga() {
  yield all(Saga);
}
