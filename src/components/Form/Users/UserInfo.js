/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { TextInput, Select, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  faEdit,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

const UserInfoForm = (props) => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("edit");
  const [initialValues, setInitialValues] = useState({
    id: props.userInfo.UserID,
    account: props.userInfo.Account,
    name: props.userInfo.Name,
    email: props.userInfo.Email,
    unit: props.userInfo.Unit,
    role_id: props.userInfo.RoleID,
  });

  const Form = useForm({
    initialValues,
    validationRules: {
      name: (value) => value !== "",
      email: (value) => value !== "",
      unit: (value) => value !== "",
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
    const loadingFunc = (bool) => setLoading(bool);
    const validation = /^([a-zA-Z0-9_.\-+])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!validation.test(values.email)) {
      Form.setFieldError('email', '請輸入Email格式');
    } else {
      props.onSubmit(values, loadingFunc);
      props.handleEdit(false);
    }
  });

  if (props.bindForm) props.bindForm(onSubmit);

  return (
    <form onSubmit={onSubmit}>
      <TextInput
        required
        style={{ marginBottom: 12 }}
        label="使用者帳號"
        disabled
        {...Form.getInputProps("account")}
      />
      <TextInput
        required
        disabled={!props.edit}
        style={{ marginBottom: 12 }}
        label="使用者名稱"
        placeholder="請輸入使用者名稱"
        {...Form.getInputProps("name")}
      />
      <TextInput
        required
        disabled={!props.edit}
        style={{ marginBottom: 12 }}
        label="Email"
        placeholder="請輸入Email"
        {...Form.getInputProps("email")}
      />
      <Select
        disabled={!props.edit}
        zIndex={500}
        required
        style={{ marginBottom: 12 }}
        label="單位"
        placeholder="請選擇單位"
        nothingFound="查無資料"
        data={props.DropDownUnit}
        {...Form.getInputProps("unit")}
      />
      <div style={{ textAlign: "center", marginTop: 12 }}>
        {props.edit && (
          <>
            <Button color="gray" style={{ marginRight: 12 }} onClick={() => props.handleEdit(false)} title="取消">
              <Icon icon={faTimes} className="mr-8" />
              取消
            </Button>
            <Button onClick={() => { onSubmit() }} loading={loading} title="儲存">
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

export default UserInfoForm;
