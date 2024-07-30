import React, { useState } from "react";
import { Button, Form, Input } from "antd";

function SignupForm() {
  const [loading,setLoading]=useState(false)
  const initialValues = {
    name: "",
    address: "",
  };

  const onFinish = (values) => {
    const { name, address } = values;
    
    const event = new CustomEvent("register_account", {
      detail: { name, address: address.replace("0x", "") },
    });
    setLoading(true)
    window.dispatchEvent(event);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Institute Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your name!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[
          {
            required: true,
            message: "Please input your Institute address!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default SignupForm;
