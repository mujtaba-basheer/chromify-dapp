import React, { useCallback, useEffect, useState } from "react";
import { Layout, Menu, Button, Card, Modal, Avatar, Spin, Typography } from "antd";
import { BookOutlined, BankOutlined } from "@ant-design/icons";
import IssueCertificateModal from "./IssueCertificateModal";
import { useSessionContext } from "../../providers/ContextProvider";
import { useNotificationContext } from "../../providers/NotificationProvider";
import logo from "../../asset/Group 1 (1).svg";
import CertificateCard from "./CertificateCard";
const { Header, Sider, Content } = Layout;
const { Paragraph } = Typography

const Certificates = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCertificatesLoading, setIsCertificatesLoading] = useState(true);
  const [isCertificateModalVisible, setIsCertificateModalVisible] =
    useState(false);
  const [certificates, setCertificates] = useState([]);
  const { session, wallet_address, account } = useSessionContext();
  const notification = useNotificationContext();
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const getCertificates = useCallback(async () => {
    if (!session || !wallet_address) return;
    try {
      setIsCertificatesLoading(true);
      const certificates = await session.query({
        name: "get_certificates_by_institute",
        args: {
          institute_wallet_address: wallet_address,
        },
      });
      setCertificates(certificates);
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error fetching certificates!",
        description: "Please try again",
      });
    } finally {
      setIsCertificatesLoading(false);
    }
  }, [session, wallet_address]);

  useEffect(() => {
    getCertificates();
  }, [getCertificates]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div style={{ display: "flex", alignItems: "center",cursor:"pointer" }} onClick={() => {
          window.location.pathname = "/";
        }}>
          {" "}
          <img
            src={logo}
            alt="Logo"
            style={{ height: "60px", marginLeft: "15px", padding: "10px" }}
          />{" "}
          <div
            style={{ fontSize: "20px", fontWeight: "500px", color: "white" }}
          >
            Chromify
          </div>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["2"]}>
          <div
            style={{
              color: "#fff",
              padding: "16px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar icon={<BankOutlined />} style={{ marginRight: "30px" }} />
            <span>{account?.name}</span>
          </div>
          {/* 
          <Menu.Item key="2">Certificates</Menu.Item> */}
          {/* <Menu.Item key="3" icon={<UserOutlined />} disabled>
            Profile
          </Menu.Item> */}
          <Menu.Item key="4" icon={<BookOutlined />}>
            NFT Certificates
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ padding: 0, display: "flex", justifyContent: "flex-end" }}
        >
          <Button type="primary" style={{ margin: "16px" }} onClick={showModal}>
            Issue NFT Certificate
          </Button>
          <Button
            type="primary"
            danger
            style={{ margin: "16px 16px 16px 0px" }}
            onClick={() => {
              window.location.pathname = "/";
            }}
          >
            Log Out
          </Button>
        </Header>

        <Content style={{ margin: "16px" }}>
          <div
            className="site-card-wrapper"
            style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}
          >
            {isCertificatesLoading && (
              <div
                style={{
                  width: "100%",
                  height: "300px",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Spin />
              </div>
            )}
            {!isCertificatesLoading &&
              (certificates.length === 0 ? (
                <div
                  style={{
                    height: "60vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <h2>Certificates will appear here once issued </h2>
                  <Button type="primary" onClick={showModal}>
                    Issue NFT Certificate
                  </Button>{" "}
                </div>
              ) : (
                certificates.map((cert) => (
                  <Card
                    key={cert.id}
                    title={<div style={{ display: "flex" }}>Certificate ID:  <Paragraph copyable={cert.id} style={{ fontWeight: "300", fontSize: "14px", margin: "0px 5px" }}> {cert.id.slice(0, 15) + ".."}</Paragraph></div>}
                    style={{
                      width: 300,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      // alignItems:"flex-start"
                    }}
                  >
                    {/* <p>
                    <b>Institution: </b> {cert.issued_by.name}
                  </p> */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                      }}
                    >
                      <p style={{ display: "inline", textAlign: "left" }}>
                        <b>Student Name: </b> {cert.student_name}
                      </p>
                      <p style={{ display: "inline", textAlign: "left" }}>
                        <b>Student ID: </b> {cert.student_id}
                      </p>
                      <p style={{ display: "inline", textAlign: "left" }}>
                        <b>Course Name: </b>
                        {cert.course_name}
                      </p>
                    </div>
                    <Button
                      block
                      onClick={() => {
                        setIsCertificateModalVisible(true);
                        setSelectedCertificate(cert);
                      }}
                    >
                      View NFT Certificate
                    </Button>
                  </Card>
                ))
              ))}
          </div>
        </Content>
      </Layout>

      {isModalVisible && (
        <IssueCertificateModal
          isOpen={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSuccess={() => getCertificates()}
        />
      )}

      {selectedCertificate && (
        <Modal
          open={isCertificateModalVisible}
          onCancel={() => {
            setIsCertificateModalVisible(false);
            setSelectedCertificate(null);
          }}
          width={1000}
          footer={null}
        >
          <CertificateCard
            certificate={selectedCertificate}
            onSuccess={getCertificates}
          />
        </Modal>
      )}
    </Layout>
  );
};

export default Certificates;
