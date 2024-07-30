import React from "react";
import { Card } from "antd";
// Import the custom CSS

import "./style.css"

const CertificateCard = ({ certificate }) => {
  const {
    id: certificate_id,
    issued_by,
    student_name,
    student_id,
    course_name,
    timestamp,
  } = certificate;

  return (
    // <Card className="certificate-card">
    <div style={{ border: "1px solid grey", padding: "6px",maxWidth:"850px",margin:"auto"  }}>
      <div style={{ border: "1px solid grey", padding: "6px" }}>
        <div style={{ border: "1px solid grey", padding: "40px",position:"relative"}}>
          <div style={{position:"absolute",  top: "5px", right: "10px", color: "#80808054" }}><>Issue Date:</>  {new Date(timestamp).toDateString()} </div>
          <div className="certificate-header">
            <div className="certificate-title">
              {issued_by.name}

            </div>
            <div className="certificate-subtitle" style={{marginBottom:"0px"}}>CERTIFICATE OF COMPLETION</div>
            
          </div>
          <div className="certificate-body" >
            <div className="certificate-text" >
              This is to certify  <div style={{ color: "#0073e6", fontSize: "40px", fontWeight: "600",lineHeight:"1.2em" }} >{student_name}</div>  <div style={{lineHeight:"2em"}}>has successfully completed the course</div> <div style={{ fontStyle: "italic", fontWeight: "700",fontSize:"28px" }}>{course_name}</div>
            </div>

          </div>
          <div className="certificate-footer">
            <div className="certificate-id">
              <div></div>Student ID <div style={{color: "#0073e660"}}>{student_id}</div>
            </div>
            <div className="certificate-id" style={{display:"flex",flexDirection:"column",alignItems:"flex-end"}}>
              <div>NFT Certificate ID</div> 
              <div style={{color: "#0073e660"}}>{certificate_id}</div>
            </div>
            {/* <div className="certificate-id">
          <strong>Course:</strong> {course_name}
        </div> */}
            {/* <div className="certificate-issue-date">
          <strong>Issue Date:</strong> {new Date(timestamp).toDateString()}
        </div> */}
          </div>
        </div>
      </div>
    </div>
    // </Card>
  );
};

export default CertificateCard;