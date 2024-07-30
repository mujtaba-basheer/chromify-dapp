import React, { useState } from "react";
import { Button, Layout, Space, Modal, Divider, spin } from "antd";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css"; // Import Ant Design styles
import SignupForm from "./SignupForm";
import logo from "../asset/Group 1 (1).svg"

const { Content, Header } = Layout;

const SignIn = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleLogin = () => {
    setLoading(true)
    const event = new CustomEvent("login_account", {});
    window.dispatchEvent(event);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header

        className="site-layout-background"
        style={{ padding: 0, display: "flex", justifyContent: "flex-start" }}
      >
        <div style={{ display: "flex", cursor: "pointer" }} onClick={() => {
          window.location.pathname = "/";
        }}>
          <img src={logo} alt="Logo" style={{ height: "100%", marginLeft: "15px", padding: "10px" }} onClick={() => {
            window.location.pathname = "/";
          }} /> <div style={{ fontSize: "30px", fontWeight: "500px", color: "white" }}>Chromify</div></div>
      </Header>

      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Space direction="vertical" size="large">

          <Button
            type="primary"
            style={{ width: "300px" }}
            onClick={handleLogin}
            size="large"
            loading={loading}
          >
            Institute Login
          </Button>
          <Button
            type="default"
            style={{ width: "300px" }}
            onClick={() => navigate("/verify-certificate")}
            size="large"
          >
            Verify NFT Certificate
          </Button>
          <Divider style={{ color: "#00000050" }}>OR</Divider>

          <Button
            type="default"
            style={{ width: "300px" }}
            onClick={showModal}
            size="large"
          >
            Institute Registration
          </Button>
        </Space>
        <Modal
          title="Register Your Institute"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <SignupForm />
        </Modal>
      </Content>
    </Layout>
  );
};

export default SignIn;
