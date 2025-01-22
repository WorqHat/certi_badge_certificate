import React from "react";
import "./certificate.css";
import { CertificateProps } from "@/types/participant";
import { v4 as uuidv4 } from "uuid";

const Certificate: React.FC<CertificateProps> = ({
  participant,
  certificateDetails,
}) => {
  return (
    <div className="certificate-container ">
      <div className="certificate space-y-4">
        <div className="certificate-header">
          <h1>{certificateDetails.title}</h1>
          <p>
            {}
            {certificateDetails.subtitle}
          </p>
        </div>
        <div className="certificate-body">
          <h2>{participant.name}</h2>
          <p>{certificateDetails.context}</p>
        </div>
        <div className="certificate-footer flex justify-center items-center space-x-12">
          <p>{uuidv4()}</p>
          <p>Date: {new Date().toLocaleDateString("en-GB")}</p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
