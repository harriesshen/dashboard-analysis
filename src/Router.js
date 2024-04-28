import React from "react";
import { Redirect, Switch } from "react-router-dom";
import _ from "lodash";
import Routes from "./routes";


const renderRoute = ({
  key,
  path,
  exact,
  component: Component,
  title,
  layout: Layout,
}) => {
  return (
    <Layout
      key={key}
      exact={exact}
      path={path}
      title={title}
      component={Component}
    />
  );
};

const App = () => {
  const routes = _.map(Routes, renderRoute);
  return (
    <Switch>
      <Redirect from="/" to={Routes[1].path} exact />
      {routes}
    </Switch>
  );
};

export default App;
