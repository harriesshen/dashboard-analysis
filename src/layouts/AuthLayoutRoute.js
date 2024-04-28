import React from "react";
import { Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import AuthLayout from "./AuthLayout";

const AuthLayoutRoute = ({ component: Component, title, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <MantineProvider
          theme={{
            fontFamily: '"Noto Sans TC", sans-serif',
            primaryColor: "teal",
          }}
        >
          <NotificationsProvider position="top-center" zIndex={600}>
            <AuthLayout {...props} title={title}>
              <Helmet>
                <title>{title}</title>
              </Helmet>
              <Component {...props} />
            </AuthLayout>
          </NotificationsProvider>
        </MantineProvider>
      )}
    />
  );
};

export default AuthLayoutRoute;
