import {
  faCogs,
  faChartBar,
  faThLarge,
} from "@fortawesome/free-solid-svg-icons";

import config from "../config";

const domain = config.domain;

export const ConvertPort = (port) => {
  if (process.env.REACT_APP_API_HOST === "localhost") return `:${port}`;
  return "";
};
export const ConvertToConform = () => {
  if (process.env.REACT_APP_API_HOST === "localhost") return `api`;
  return "api/System";
};
export default [
  {
    path: `/AccidentAnalysis`,
    title: "分析",
    useable: process.env.REACT_APP_MODULE_A_USEABLE === "true" ? true : false,
    icon: faChartBar,
    children: [
      {
        path: `/AccidentAnalysis/Feature`,
        title: "報表",
        useable: true,
        id: "A02",
      },
      {
        path: `/AccidentAnalysis/AccidentDistribution`,
        title: "點位分佈",
        useable: true,
        id: "A03",
      },
    ],
  },

  {
    path: `/System`,
    title: "系統管理",
    useable: process.env.REACT_APP_MODULE_S_USEABLE === "true" ? true : false,
    icon: faCogs,
    children: [
      {
        path: `/System/Account`,
        title: "帳號管理",
        useable: true,
        id: "S01",
      },
    ],
  },
];
