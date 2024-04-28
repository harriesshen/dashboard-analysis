import React from "react";
import { Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

import { NotificationsProvider } from "@mantine/notifications";
import Layout from "./Layout";

const LayoutRoute = ({ component: Component, title, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <MantineProvider
          theme={{
            fontFamily: '"Noto Sans TC", sans-serif',
            primaryColor: "blue",
          }}
        >
          <ModalsProvider>
            <NotificationsProvider position="top-center" zIndex={600}>
              <Layout {...props} title={title}>
                <Helmet>
                  <title>{title}</title>
                </Helmet>
                <Component {...props} />
              </Layout>
            </NotificationsProvider>
          </ModalsProvider>
        </MantineProvider>
      )}
    />
  );
};

export default LayoutRoute;
