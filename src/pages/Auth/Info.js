/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { Title, Tabs, Grid } from "@mantine/core";
import { getToken, setToken } from "../../utils/token";

import UserInfoForm from "../../components/Form/Users/UserInfo";
import UserPasswordForm from "../../components/Form/Users/UserPassword";
import "./Info.scss";


const Info = (props) => {
  const [tabValue, setTabValue] = useState('');
  const [count, setCount] = useState(0);
  const [edit, setEdit] = useState(false);

  let { Token, UserID, Account, Name, Email, Unit, RoleID, Process } = getToken();
  useEffect(() => {
    props.GET_Units();
    props.GET_UserID({ UserID: UserID })
  }, []);

  useEffect(() => {
    ({ Token, UserID, Account, Name, Email, Unit, RoleID, Process } = getToken());
  }, [count]);

  const handleEdit = (e) => {
    setEdit(e);
  }

  const onUserInfoEdit = (values, loading) => {
    const body = {
      UserID: values.id,
      name: values.name,
      email: values.email,
      unit: values.unit,
    }
    const infoBody = { "Token": Token, "UserID": UserID, "Account": Account, "Name": values.name, "Email": values.email, "Process": Process, "Unit": values.unit, "RoleID": RoleID }
    const callback = () => {
      setToken(infoBody);
      setCount(count + 1);
      setEdit(false);
    }
    props.PUT_User(body, callback, loading);
  }
  const onUserPasswordEdit = (values, loading) => {
    console.log(values);
    if (values.Old_password !== "" && values.New_password !== "") {
      const body = _.pick(values, [
        "account",
        "Old_password",
        "New_password",
      ]);
      const callback = (error) => {
        if (!error) {
          props.SAVE_Message({
            color: "cyan",
            title: "密碼修改成功！",
            message: "密碼修改完成，請重新登入！",
          })
          setTimeout(() => { props.Logout() }, 2000); // 重新登入計時器
        }
      }
      props.UPDATE_UserPassword(body, callback, loading);
    } else {
      props.SAVE_Message({
        color: "red",
        title: "修改密碼錯誤！",
        message: "舊密碼與新密碼不得為空！",
      })
    }
  }
  return (
    <div id="Info" >
      <Title className="title">個人資料管理</Title>
      <div>
        <Tabs defaultValue="editUserInfo" onTabChange={tabValue}>
          <Tabs.List>
            <Tabs.Tab value="editUserInfo" >基本資料</Tabs.Tab>
            <Tabs.Tab value="editPassword">變更密碼</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="editUserInfo" >
            <div className="tabPanel">
              <div className="tabForm">
                <UserInfoForm
                  userInfo={{ UserID, Account, Name, Email, Unit, RoleID }}
                  edit={edit}
                  handleEdit={handleEdit}
                  onSubmit={((value, loding) => onUserInfoEdit(value, loding))}
                  DropDownUnit={props.Units}
                />
              </div>
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="editPassword" >
            <div className="tabPanel">
              <div className="tabForm">
                <UserPasswordForm
                  Account={Account}
                  edit={edit}
                  handleEdit={handleEdit}
                  onSubmit={(value, loading) => { onUserPasswordEdit(value, loading) }}
                />
              </div>
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    Units: _.get(state, "system.Units", []),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    SAVE_Message(payload) {
      dispatch({ type: "SAVE_Message", payload });
    },
    GET_Units(payload, callback, loading) {
      dispatch({ type: "GET_Units", payload, callback, loading });
    },
    PUT_User(payload, callback, loading) {
      dispatch({ type: "PUT_User", payload, callback, loading });
    },
    UPDATE_UserPassword(payload, callback, loading) {
      dispatch({ type: "UPDATE_UserPassword", payload, callback, loading });
    },
    Logout(payload) {
      dispatch({ type: "Logout", payload });
    },
    GET_UserID(payload, callback, loading) {
      dispatch({ type: "GET_UserID", payload, callback, loading });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Info);
