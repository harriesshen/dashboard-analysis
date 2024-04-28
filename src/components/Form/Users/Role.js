/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { TextInput, MultiSelect } from "@mantine/core";
import { useForm } from "@mantine/form";

const RoleForm = (props) => {
  const [type, setType] = useState("create");

  const [initialValues, setInitialValues] = useState({
    role_name: "",
    md_id: [],
  });

  const Form = useForm({
    initialValues,
    validationRules: {
      role_name: (value) => value !== "",
      md_id: (value) => value.length > 0,
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
    if (values.role_name === "") {
      Form.setFieldError("role_name", "請填入內容");
    } else if (values.md_id.length === 0) {
      Form.setFieldError("md_id", "請選擇內容");
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
        label="角色名稱"
        placeholder="請輸入角色名稱"
        {...Form.getInputProps("role_name")}
      />
      <MultiSelect
        required
        searchable
        zIndex={500}
        style={{ marginBottom: 12 }}
        label="權限管理"
        placeholder="請選擇權限管理"
        nothingFound="查無資料"
        data={props.Modules}
        clearable
        {...Form.getInputProps("md_id")}
      />
    </form>
  );
};

export default RoleForm;
