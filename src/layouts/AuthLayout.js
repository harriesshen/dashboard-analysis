/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import moment from "moment";
import { connect } from "react-redux";
import { showNotification } from "@mantine/notifications";
import "./AuthLayout.scss";

const AuthLayout = (props) => {
  const myRef = useRef();
  // const { BackgroundColor } = props; // state

  // useEffect(() => {
  //   if (BackgroundColor)
  //     document.documentElement.style.setProperty(
  //       "--mixin-color",
  //       BackgroundColor
  //     );
  // }, [BackgroundColor]);

  useEffect(() => {
    if (props.Message) {
      const { color, message, title, loading } = props.Message;
      showNotification({
        color: color,
        title: title,
        message: message,
        loading,
      });
      props.SAVE_Message(undefined);
    }
  }, [props.Message]);

  return (
    <div ref={myRef} id="AuthLayout" className="layout">
      {props.children}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    Message: _.get(state, "global.Message", false),
    BackgroundColor: _.get(state, "global.BackgroundColor", ""),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    SAVE_Message(payload) {
      dispatch({ type: "SAVE_Message", payload });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthLayout);
