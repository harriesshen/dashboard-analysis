import React from "react";
import { Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "./EmptyLayout.scss";

const EmptyLayoutRoute = ({ component: Component, title, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <MantineProvider
          theme={{
            fontFamily: '"Noto Sans TC", sans-serif',
            primaryColor: "orange",
          }}
        >
          <div id="EmptyLayout">
            <Component {...props} />
          </div>
        </MantineProvider>
      )}
    />
  );
};

export default EmptyLayoutRoute;
