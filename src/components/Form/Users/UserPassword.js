/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { PasswordInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  faEdit,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

const UserPassword = (props) => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("create");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [initialValues, setInitialValues] = useState({
    Old_password: "",
  });

  const Form = useForm(
    {
      initialValues,
      validationRules: {
        Old_password: (value) => value !== "",
      },
    },
  );

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
    const loadingFunc = (bool) => setLoading(bool);
    props.onSubmit({
      ...values,
      New_password: password,
      account: props.Account,
    }, loadingFunc)
  });

  if (props.bindForm) props.bindForm(onSubmit);

  return (
    <form onSubmit={onSubmit}>
      <PasswordInput
        required
        disabled={!props.edit}
        style={{ marginBottom: 12 }}
        label="舊密碼"
        placeholder="請輸入舊密碼"
        {...Form.getInputProps("Old_password")}
      />
      <PasswordInput
        required={type === "create"}
        disabled={!props.edit}
        style={{ marginBottom: 12 }}
        label="新密碼"
        placeholder="請輸入新密碼"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordInput
        required={type === "create"}
        disabled={!props.edit}
        style={{ marginBottom: 12 }}
        label="確認密碼"
        placeholder="請輸入確認密碼"
        value={passwordCheck}
        onChange={(e) => setPasswordCheck(e.target.value)}
        error={password === passwordCheck ? false : "確認密碼與密碼不一致"}
      />

      <div style={{ textAlign: "center", marginTop: 12 }}>
        {props.edit && (
          <>
            <Button color="gray" style={{ marginRight: 12 }} onClick={() => props.handleEdit(false)} title="取消">
              <Icon icon={faTimes} className="mr-8" />
              取消
            </Button>
            <Button onClick={() => { onSubmit() }} disabled={password !== passwordCheck} loading={loading} title="儲存">
              <Icon icon={faCheck} className="mr-8" />
              儲存
            </Button>
          </>
        )}
        {!props.edit && (
          <Button color="orange" onClick={() => props.handleEdit(true)} title="編輯">
            <Icon icon={faEdit} className="mr-8" />
            編輯
          </Button>
        )}
      </div>
    </form>
  );
};

export default UserPassword;
