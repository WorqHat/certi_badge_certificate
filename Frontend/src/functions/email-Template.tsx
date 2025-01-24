import { CertificationMailProps } from "@/types/participant";
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import React from "react";

export const CertificationMail: React.FC<CertificationMailProps> = ({
  certificateDetails,
  participant,
  senderEmail,
  senderName,
}) => {
  const certificateLink = `${import.meta.env.VITE_FRONTEND_URL}/view/${certificateDetails.certificateId}`;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Img
              width={200}
              alt="Certificate Logo"
              title="Certificate Logo"
              style={{
                display: "block",
                margin: "0 auto",
                maxWidth: "100%",
                height: "auto",
              }}
              src={"https://worqhat.com/resources/WorqHat%20TM%20Logo.png"}
            />

            <Text
              style={{
                ...paragraph,
                fontSize: "24px",
                lineHeight: "32px",
                marginBottom: "20px",
              }}
            >
              Congratulations, {participant.name}!
            </Text>

            <Text style={paragraph}>
              We are thrilled to inform you that you have been awarded the
              certificate titled "<strong>{certificateDetails.title}</strong>"
              for your outstanding performance and participation.
            </Text>
            <Text style={paragraph}>Details of your certificate:</Text>
            <Text style={paragraph}>
              <strong>Issued On:</strong> {certificateDetails.issueDate}
            </Text>
            <Text style={paragraph}>
              <strong>Expires On:</strong> {certificateDetails.expiryDate}
            </Text>

            <Section style={{ textAlign: "center", margin: "20px 0" }}>
              <Link href={certificateLink} style={joinButton}>
                View Certificate
              </Link>
            </Section>

            <Text style={paragraph}>
              You can access your certificate anytime by clicking the button
              above or visiting the following link:
            </Text>

            <Text style={paragraph}>
              <Link href={certificateLink} style={linkStyle}>
                {certificateLink}
              </Link>
            </Text>

            <Hr style={divider} />

            <Text style={paragraph}>
              If you have any questions or require further assistance, please
              feel free to contact us at {senderEmail}.
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Text style={footerText}>
            This email was sent to {participant.email} by {senderName}.
          </Text>

          <Text style={footerAddress}>
            <strong>WorqHat (Winlysis Pvt. Ltd.)</strong>, 11 CoWork, Spot18
            Mall, Pune, MH, India
          </Text>
          <Text style={footerHeart}>
            We are proud to recognize your achievement! 🎉
          </Text>
          <Text style={footerHeart}>{"💙 from India"}</Text>
        </Section>
      </Body>
    </Html>
  );
};

export default CertificationMail;

const joinButton = {
  display: "inline-block",
  backgroundColor: "#4CAF50",
  color: "#fff",
  padding: "15px 50px",
  textDecoration: "none",
  borderRadius: "5px",
  fontWeight: "bold",
  fontSize: "18px",
  marginTop: "25px",
  marginBottom: "25px",
};

const linkStyle = {
  color: "#4CAF50",
  textDecoration: "none",
  borderBottom: "1px dashed #4CAF50",
  fontWeight: "bold",
  marginTop: "15px",
  display: "inline-block",
};

const main = {
  backgroundColor: "#f9f9f9",
  fontFamily: "Arial, sans-serif",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#333",
  textAlign: "center" as const,
  margin: "15px 0",
};

const divider = {
  margin: "30px 0",
  border: "none",
  borderTop: "1px solid #ddd",
};

const container = {
  width: "680px",
  maxWidth: "100%",
  margin: "0 auto",
  padding: "20px",
};

const footer = {
  width: "680px",
  maxWidth: "100%",
  margin: "32px auto 0 auto",
  padding: "0 30px",
  textAlign: "left" as const,
};

const content = {
  padding: "30px 30px 40px 30px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  lineHeight: "15px",
  color: "#999",
  margin: "0",
  textAlign: "center" as const,
};

const footerAddress = {
  margin: "4px 0",
  fontSize: "12px",
  lineHeight: "15px",
  color: "#999",
  textAlign: "center" as const,
};

const footerHeart = {
  fontSize: "12px",
  lineHeight: "15px",
  color: "#333",
  textAlign: "center" as const,
  marginTop: "10px",
};
