import React from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Checkbox,
  Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

const LoginForm = (props) => {
  const Form = useForm({
    initialValues: { account: "", password: "" },

    validationRules: {
      account: (value) => value.trim().length > 0,
      password: (value) => value.trim().length > 0,
    },
  });

  const onSubmit = Form.onSubmit((values) => {
    props.onSubmit(values);
  });

  return (
    <form onSubmit={onSubmit} style={{ width: "100%" }}>
      <Flex direction={"column"} align={"center"}>
        <TextInput
          required
          size="lg"
          style={{
            width: "50%",
            marginBottom: 12,
            marginTop: 30,
          }}
          icon={<Icon icon={faUser} />}
          placeholder="輸入帳號"
          {...Form.getInputProps("account")}
        />

        <PasswordInput
          required
          size="lg"
          style={{
            width: "50%",
            marginBottom: 12,
          }}
          icon={<Icon icon={faLock} />}
          placeholder="輸入密碼"
          {...Form.getInputProps("password")}
        />

        <Button
          type="submit"
          size="lg"
          radius="xl"
          loading={props.loading}
          onClick={() => onSubmit}
          style={{
            width: "50%",
          }}
          className="bg-primary"
        >
          登入
        </Button>
      </Flex>
    </form>
  );
};

export default LoginForm;
