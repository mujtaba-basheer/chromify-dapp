import { Button, Form, Input, message, Modal } from "antd";
import { useCallback, useState } from "react";
import { useSessionContext } from "../../providers/ContextProvider";
import { useNotificationContext } from "../../providers/NotificationProvider";
import short from "short-uuid";
import "./style.css"

const IssueCertificateModal = ({ isOpen, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading,setLoading]=useState(false)
  const { session, wallet_address } = useSessionContext();
  const notification = useNotificationContext();

  const initialValues = {
    owner: "",
    student_id: "",
    student_name: "",
    course_name: "",
  };

  const handleSubmit = useCallback(
    async (values) => {
      try {
        if (!session) return;
        console.log({args: values})
        const { course_name, student_name, student_id, owner } = values;
        await session.call({
          name: "mint_certificate",
          args: [
            wallet_address,
            short.generate(),
            owner.replace("0x", ""),
            student_id,
            student_name,
            course_name,
          ],
        });
        notification.success({ message: "NFT Certificate successfully issued!" });
        if (onSuccess) onSuccess()
        onCancel();
      } catch (error) {
        console.error(error);
        notification.error({
          message: "Error issuing NFT certificate! Please try again.",
        });
      }
    },
    [session]
  );

  return (
    <Modal
    title={<span style={{fontSize:"24px",textAlign:"center"}}>Issue NFT Certificate</span>}
      open={isOpen}
      onCancel={onCancel}
      initialValues={initialValues}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} style={{ padding: "20px",display:"flex",gap:"0px",flexDirection:"column" }}>
        <Form.Item
          layout="vertical"
          label="Student's Metamask Wallet Address"
          name="owner"
          rules={[
            { required: true, message: "Please input the Wallet Address!" },
          ]}
          style={{ marginBottom: "20px",minHeight: "70px" }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          layout="vertical"
          label="Student ID"
          name="student_id"
          rules={[{ required: true, message: "Please input the Student ID!" }]}
          style={{ marginBottom: "20px",minHeight: "70px" }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          layout="vertical"
          label="Student Name"
          name="student_name"
          rules={[
            { required: true, message: "Please input the Student Name!" },
          ]}
          style={{ marginBottom: "20px",minHeight: "70px" }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          layout="vertical"
          label="Course Name"
          name="course_name"
          rules={[{ required: true, message: "Please input the Course Name!" }]}
          style={{ marginBottom: "20px",minHeight: "70px" }}
        >
          <Input />
        </Form.Item>
        <Form.Item style={{ display: "flex", justifyContent: "flex-end",minHeight:"20px",margin:"0px" }}>
          <Button type="primary" htmlType="submit" loading={loading} onClick={()=>{setLoading(true)}}>
            Submit
          </Button>
        </Form.Item>
      </Form>

    </Modal>
  );
};

export default IssueCertificateModal;
