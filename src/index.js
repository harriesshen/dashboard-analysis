import "leaflet/dist/leaflet.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import history from "./utils/history";
import "./index.scss";

import RouterApp from "./Router";
import store from "./store";


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <RouterApp />
    </Router>
  </Provider>,
  document.getElementById("root")
);
