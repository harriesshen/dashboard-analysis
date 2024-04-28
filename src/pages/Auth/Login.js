import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Card, Text, Group } from "@mantine/core";
import _ from "lodash";
import LoginForm from "../../components/Form/Auth/Login";
import "./Login.scss";
import history from "../../utils/history";

const Login = (props) => {
  const LoginFn = (values) => {
    // const body = { op_id: values.account, op_pswd: values.password };
    // const callback = (error) => {
    // if (!error) props.PUSH_GoToRoute("/Home", { login: true });
    // if(!error) props.GoOtherWindow()
    // };
    // props.POST_Login(body, callback);
    // props.PUSH_GoToRoute("/Home", { login: true });
    history.push("/System/Account");
  };

  return (
    <div id="login">
      <div className="circles">
        {_.map(Array(20), (i, index) => (
          <li aria-label="square" key={`square${index}`}></li>
        ))}
      </div>
      <Card className="form-card" shadow="md" padding="xs" mr={"lg"}>
        <Group position="apart">
          <Text className="text" weight={600}>
            登入
          </Text>
        </Group>
        <LoginForm onSubmit={LoginFn} />
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    title: _.get(state, "global.Title", ""),
    LogoSrc: _.get(state, "global.LogoSrc", ""),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    POST_Login(payload, callback, loading) {
      dispatch({ type: "POST_Login", payload, callback, loading });
    },
    PUSH_GoToRoute(path, payload) {
      dispatch({ type: "PUSH_GoToRoute", path, payload });
    },
    GET_FrontendStyle() {
      dispatch({ type: "GET_FrontendStyle" });
    },
    GoOtherWindow(path) {
      dispatch({ type: "GoOtherWindow", path });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
