import _ from "lodash";
import AuthLayoutRoute from "../layouts/AuthLayoutRoute";
import LayoutRoute from "../layouts/LayoutRoute";
import EmptyLayoutRoute from "../layouts/EmptyLayoutRoute";

import Home from "../pages/Home";
import Login from "../pages/Auth/Login";

// 系統管理模組
import Account from "../pages/System/Account";
import Feature from "../pages/AccidentAnalysis/Feature/Feature";
import AccidentDistribution from "../pages/AccidentAnalysis/AccidentDistribution/AccidentDistribution";

export default [
  {
    key: "/Home",
    path: "/Home",
    exact: true,
    component: Home,
    layout: LayoutRoute,
    title: "project",
  },
  {
    key: "/auth/login",
    path: "/auth/login",
    exact: true,
    component: Login,
    layout: AuthLayoutRoute,
    title: "project",
  },
  {
    key: "/System/Account",
    path: "/System/Account",
    exact: true,
    component: Account,
    layout: LayoutRoute,
    title: "project",
  },
  {
    key: "/AccidentAnalysis/Feature",
    path: "/AccidentAnalysis/Feature",
    exact: true,
    component: Feature,
    layout: LayoutRoute,
    title: "project",
  },
  {
    key: "/AccidentAnalysis/AccidentDistribution",
    path: "/AccidentAnalysis/AccidentDistribution",
    exact: true,
    component: AccidentDistribution,
    layout: LayoutRoute,
    title: "project",
  },
];
