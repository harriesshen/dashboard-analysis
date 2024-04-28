/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import _ from "lodash";
import moment from "moment";
import { TextInput, Select, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";

const AccountForm = (props) => {
  const [type, setType] = useState("create");
  const [initialValues, setInitialValues] = useState({
    op_name: "",
    op_id: "",
    op_pswd: "",
    passwordCheck: "",
    email: "",
    // unit: "",
    role_id: "",
  });

  const Form = useForm({
    initialValues,
    validationRules: {
      op_id: (value) => value !== "",
      op_name: (value) => value !== "",
      op_pswd: (value) => {
        if (type === "create") return value !== "";
        else return true;
      },
      passwordCheck: (value, obj) => {
        if (type === "create") return value !== "" && value === obj.op_pswd;
        else return value === obj.op_pswd;
      },
      email: (value) => value !== "",
      // unit: (value) => value !== "",
      role_id: (value) => value !== "",
    },
  });

  useEffect(() => {
    if (
      !_.isEqual(props.initialValues, initialValues) &&
      !_.isEmpty(props.initialValues)
    ) {
      Form.setValues(props.initialValues);
      setType("edit");
      setInitialValues(props.initialValues);
    }
  }, [props.initialValues]);

  const onSubmit = Form.onSubmit((values) => {
    const validation =
      /^([a-zA-Z0-9_.\-+])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const checkAccount = /^([\w])+$/;
    // edit 時過濾掉密碼 檢查欄位是否有填
    const keyNoValue =
      type === "create"
        ? Object.keys(values).filter((key) => values[key] === "")
        : Object.keys(values)
            .filter((key) => !["op_pswd", "passwordCheck"].includes(key))
            .filter((key) => values[key] === "");

    if (keyNoValue.length > 0) {
      // 取第一個為空的欄位做必填提示
      Form.setFieldError(keyNoValue[0], "請輸入內容");
    } else if (!validation.test(values.email)) {
      Form.setFieldError("email", "請輸入Email格式");
    } else if (!checkAccount.test(values.op_id)) {
      Form.setFieldError("op_id", "帳號不可輸入文字、符號");
    } else if (values.op_pswd !== values.passwordCheck && type === "create") {
      Form.setFieldError("passwordCheck", "密碼確認與密碼輸入不相同");
    } else if (values.role_id === "") {
      Form.setFieldError("role_id", "請選擇角色權限");
    } else {
      props.onSubmit(values);
    }
  });

  if (props.bindForm) props.bindForm(onSubmit);

  return (
    <form onSubmit={onSubmit}>
      <TextInput
        required
        style={{ marginBottom: 12 }}
        label="使用者名稱"
        placeholder="請輸入使用者名稱"
        {...Form.getInputProps("op_name")}
      />
      <TextInput
        required
        disabled={type === "edit"}
        style={{ marginBottom: 12 }}
        label="使用者帳號"
        placeholder="請輸入使用者帳號"
        {...Form.getInputProps("op_id")}
      />
      {type === "create" && (
        <>
          <PasswordInput
            required={type === "create"}
            style={{ marginBottom: 12 }}
            label="使用者密碼"
            placeholder="請輸入使用者密碼"
            {...Form.getInputProps("op_pswd")}
          />
          <PasswordInput
            required={type === "create"}
            style={{ marginBottom: 12 }}
            label="密碼確認"
            placeholder="請輸入密碼確認"
            {...Form.getInputProps("passwordCheck")}
          />
        </>
      )}

      <TextInput
        required
        style={{ marginBottom: 12 }}
        label="Email"
        placeholder="請輸入Email"
        {...Form.getInputProps("email")}
      />
      {/* <Select
        zIndex={500}
        required
        style={{ marginBottom: 12 }}
        label="單位"
        placeholder="請選擇單位"
        nothingFound="查無資料"
        data={props.unit}
        {...Form.getInputProps("unit")}
      /> */}
      <Select
        zIndex={500}
        required
        style={{ marginBottom: 12 }}
        label="使用者角色"
        placeholder="請選擇使用者角色"
        nothingFound="查無資料"
        data={props.role}
        {...Form.getInputProps("role_id")}
      />
    </form>
  );
};

export default AccountForm;
