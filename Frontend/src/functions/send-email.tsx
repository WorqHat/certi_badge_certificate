import { Suspense } from "react";
import CertificationMail from "./email-Template";
import ReactDOMServer from "react-dom/server";
import { certificateProps, UserDetails } from "@/types/participant";

const sendInvitationEmail = async (
  certificateDetails: certificateProps,
  participant: UserDetails,
  senderEmail: string,
  senderName: string
) => {
  // Iterate over each email and newInviteLink in the newInviteLinks object

  try {
    // Render the email HTML with the current email and invite link
    const emailHtml = ReactDOMServer.renderToStaticMarkup(
      <Suspense fallback={<div>Loading...</div>}>
        <CertificationMail
          certificateDetails={certificateDetails || {}}
          participant={participant || {}}
          senderEmail={senderEmail || ""}
          senderName={senderName || ""}
        />
      </Suspense>
    );
    // console.log(typeof emailHtml);
    // console.log(emailHtml);

    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/invitation/send-invitation-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: participant.email,
          subject: `${senderName} acknowledged your Achievement of Exellence!! 👋🏻`,
          html: emailHtml,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to send email");
    }

    console.log(`Email sent to ${participant.email}`);
  } catch (error) {
    console.log(`Failed to send email to ${participant.email}`, error);
  }
};

export default sendInvitationEmail;
