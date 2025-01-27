import React from "react";
import "./certificate.css";
import { CertificateProps } from "@/types/participant";
import worqhatlogo from "@/assets/images/logo-blue.png";

const Certificate: React.FC<CertificateProps> = ({
  certificateRef,
  participant,
  certificateDetails,
}) => {
  return (
    <div className="certificate-container ">
      <div className="certificate space-y-4" ref={certificateRef}>
        <div className="certificate-header">
          <div className="flex justify-center items-center">
            <img src={worqhatlogo} alt="WorqHat" className="w-24 h-auto" />
          </div>
          <h1>{certificateDetails.title}</h1>
          <p>{certificateDetails.subtitle}</p>
        </div>
        <div className="certificate-body">
          <h2>{participant.name}</h2>
          <p>{certificateDetails.context}</p>
        </div>
        <div className="certificate-footer flex justify-center items-center space-x-12">
          <p>Issue Date: {certificateDetails.issueDate}</p>
          <p>Expiry Date: {certificateDetails.expiryDate}</p>
        </div>
        <p className="text-xs text-neutral-400">
          {certificateDetails.certificateId}
        </p>
      </div>
    </div>
  );
};

export default Certificate;

//  https://discord.com/invite/KHh9mguKBx
