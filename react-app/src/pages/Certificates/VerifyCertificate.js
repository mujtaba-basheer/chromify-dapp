import React, { useCallback, useEffect, useRef, useState } from "react";
import { Form, Input, Button, Layout, Modal, Typography } from "antd";
import logo from "../../asset/Group 1 (1).svg";
import { Footer } from "antd/es/layout/layout";
import { createClient } from "postchain-client";
import CertificateCard from "./CertificateCard";
import { useSessionContext } from "../../providers/ContextProvider";
import { useNotificationContext } from "../../providers/NotificationProvider";
import { checkForDevMode } from "../../utils";
import { chromiaClientConfig, getChromiaClientDevConfig } from "../../config";
const { Header, Sider, Content } = Layout;
const digitalCertificate = require("../../asset/verify.jpg");
const { Title } = Typography;

const VerifyCertificates = () => {
  const [isCertificateModalVisible, setIsCertificateModalVisible] =
    useState(false);
  const [certificate, setCertificate] = useState(null);
  const { session } = useSessionContext();
  const notification = useNotificationContext();
  const clientRef = useRef(null);

  const [form] = Form.useForm();
  const initialValues = {
    certificate_id: "",
    student_id: "",
  };

  const initClient = useCallback(async () => {
    if (clientRef.current) return;
    try {
      const isDevMode = checkForDevMode();
      const client = await createClient(
        isDevMode ? await getChromiaClientDevConfig() : chromiaClientConfig
      );
      clientRef.current = client;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onFinish = async (values) => {
    try {
      const client = clientRef.current;
      if (!client) return;

      const certificate = await client.query("verify_nft_certificate", values);
      setCertificate(certificate);
      setIsCertificateModalVisible(true);
    } catch (error) {
      console.error(error);
      notification.error({
        message: "INVALID NFT CERTIFICATE",
        description: "Please check the entered details and try again.",
      });
    }
  };

  useEffect(() => {
    initClient();
  }, [initClient]);

  return (
    <div>
      <Header
        className="site-layout-background"
        style={{ padding: 0, display: "flex", justifyContent: "flex-start" }}
      >
        <div onClick={() => {
            window.location.pathname = "/";
          }} style={{ cursor:"pointer",display:"flex"}}>
        <img
          
          src={logo}
          alt="Logo"
          style={{ height: "100%", marginLeft: "15px", padding: "10px",cursor:"pointer" }}
          />{" "}
        <div style={{ fontSize: "30px", fontWeight: "500px", color: "white" }}>
          Chromify
        </div>
          </div>
      </Header>
      <div style={{ height: "95vh", display: "flex" }}>
        <div style={{ flex: 1 }}>
          <img
            src={digitalCertificate}
            alt="Placeholder"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}>
          <Title level={2} style={{ marginBottom: "30px" }}>Verify NFT Certificate</Title>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Form
              form={form}
              initialValues={initialValues}
              name="certificate_form"
              onFinish={onFinish}
              style={{ width: "80%", maxWidth: "400px" }}
              layout="vertical"
            >
              <Form.Item
                label="Student ID"
                name="student_id"
                rules={[
                  { required: true, message: "Please input your Student ID!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Certificate ID"
                name="certificate_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your Certificate ID!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        {certificate && (
          <Modal
            open={isCertificateModalVisible}
            onCancel={() => {
              setIsCertificateModalVisible(false);
            }}
            footer={null}
            width={1000}
            style={{ padding: "20px" }}
          >
            <CertificateCard certificate={certificate} />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificates;
