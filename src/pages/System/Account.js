import React, { useState, useEffect, useRef, useCallback } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { Button, Input, Modal, Table, TextInput, Title } from "@mantine/core";
import { closeAllModals, openConfirmModal } from "@mantine/modals";
import "./Account.scss";

const headColumn = ["使用者名稱", "帳號", "信箱", "操作"];
const validation =
  /^([a-zA-Z0-9_.\-+])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const Account = (props) => {
  const {
    POST_Account,
    PUT_Account,
    DELETE_Account,
    GET_Account,
    SAVE_Message,
  } = props; // dispatch
  const { AllAccount } = props; // state
  const nameRef = useRef("");
  const accountRef = useRef("");
  const emailRef = useRef("");

  useEffect(() => {
    GET_Account();
  }, []);

  const onCreate = () => {
    const nameValue = nameRef.current.value;
    const accountValue = accountRef.current.value;
    const emailValue = emailRef.current.value;
    const body = {
      name: nameValue,
      account: accountValue,
      email: emailValue,
    };
    let msg = "";

    if (nameValue === "") {
      msg += "名稱、";
    }
    if (accountValue === "") {
      msg += "帳號、";
    }
    if (emailValue === "") {
      msg += "信箱";
    }
    if (emailValue !== "" && !validation.test(emailValue)) {
      msg += "正確的信箱資料";
    }
    if (msg !== "")
      SAVE_Message({
        color: "red",
        title: "錯誤",
        message: `請輸入${msg}欄位`,
      });
    console.log("create post", body);
    if (
      nameValue &&
      accountValue &&
      emailValue &&
      validation.test(emailValue)
    ) {
      POST_Account(body);
      closeAllModals();
    }
  };

  const onEdit = () => {
    const nameValue = nameRef.current.value;
    const accountValue = accountRef.current.value;
    const emailValue = emailRef.current.value;
    const body = {
      name: nameValue,
      account: accountValue,
      email: emailValue,
    };
    console.log("edit value", body);
    PUT_Account(body);
  };

  const onDelete = (value) => {
    DELETE_Account(value);
  };

  const openAddModal = () =>
    openConfirmModal({
      title: "新增使用者",
      closeOnConfirm: false,
      children: (
        <>
          <TextInput required label="名稱" placeholder="名稱" ref={nameRef} />
          <TextInput
            required
            label="帳號"
            placeholder="帳號"
            ref={accountRef}
          />
          <TextInput
            required
            label="信箱"
            placeholder="信箱"
            ref={emailRef}
            // error={validation.test(emailRef.current) ? "" : "error"}
          />
        </>
      ),
      labels: {
        confirm: "確定",
        cancel: "取消",
      },
      onConfirm: onCreate,
    });
  const openEditModal = () =>
    openConfirmModal({
      title: "編輯使用者",
      children: (
        <div>
          <TextInput
            required
            label="名稱"
            placeholder="名稱"
            ref={nameRef}
            defaultValue={nameRef.current}
          />
          <TextInput
            label="帳號"
            placeholder="帳號"
            ref={accountRef}
            defaultValue={accountRef.current}
            disabled
          />
          <TextInput
            label="信箱"
            placeholder="信箱"
            ref={emailRef}
            defaultValue={emailRef.current}
          />
        </div>
      ),

      labels: {
        confirm: "確定",
        cancel: "取消",
      },
      onConfirm: onEdit,
    });
  return (
    <div id="Account">
      <Title className="title">帳號管理</Title>
      <Button onClick={openAddModal}>新增</Button>
      <Table highlightOnHover striped withBorder withColumnBorders mt={10}>
        <thead>
          <tr>
            {_.map(headColumn, (i) => (
              <th aria-label={i} key={i}>
                {i}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {_.map(AllAccount, (i) => (
            <tr key={i.name}>
              <td aria-label={i.name}>{i.name}</td>
              <td aria-label={i.account}>{i.account}</td>
              <td aria-label={i.email}>{i.email}</td>
              <td aria-label={`${i.name}control`}>
                <Button
                  mr={10}
                  onClick={() => {
                    nameRef.current = i.name;
                    accountRef.current = i.account;
                    emailRef.current = i.email;
                    openEditModal();
                  }}
                >
                  編輯
                </Button>
                <Button onClick={() => onDelete(i.account)}>刪除</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    AllAccount: _.get(state, "account.AllAccount", []),
    Roles: _.get(state, "dropdown.Roles", []),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    GET_Account(callback, loading) {
      dispatch({ type: "GET_Account", callback, loading });
    },
    GET_Roles(payload, callback, loading) {
      dispatch({ type: "GET_Roles", payload, callback, loading });
    },
    GET_Units(payload, callback, loading) {
      dispatch({ type: "GET_Units", payload, callback, loading });
    },
    POST_Account(payload, callback, loading) {
      dispatch({ type: "POST_Account", payload, callback, loading });
    },
    PUT_Account(payload, callback, loading) {
      dispatch({ type: "PUT_Account", payload, callback, loading });
    },
    DELETE_Account(op_id, callback, loading) {
      dispatch({ type: "DELETE_Account", op_id, callback, loading });
    },
    SAVE_Message(payload) {
      dispatch({ type: "SAVE_Message", payload });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
