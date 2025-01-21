import { db } from "./firebaseConfig";
import { doc, Timestamp, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { render } from "@react-email/render";
import InternalInvitationEmail from "@/Templates/Mails/invite-members";

async function sendEmail(to: string, subject: string, html: string) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/emails/send-email/processor`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mailTo: [to],
          subject: subject,
          mailBody: html,
          mailFrom: "SmartMocks Interview AI <interviews@updates.worqhat.com>",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    const data = await response.json();
    console.log("Email sent:", data);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function inviteMember(
  orgId: string,
  orgName: string,
  email: string,
  role: string,
  invitedByUsername: string,
  invitedByEmail: string
) {
  const invitationCode = crypto.randomUUID();
  const invitationExpiry = Timestamp.fromDate(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ); // 7 days from now

  try {
    // Add the invitation to Firestore
    await setDoc(doc(db, "Invitations", invitationCode), {
      orgId,
      email,
      role,
      invitationCode,
      status: "pending",
      createdAt: Timestamp.now(),
      expiresAt: invitationExpiry,
    });

    console.log("Invitation added to Firestore", invitationCode);

    // Render the email component to HTML using @react-email/render
    const emailHtml = await render(
      <InternalInvitationEmail
        emailAddress={email}
        invitationCode={invitationCode}
        orgName={orgName}
        invitedByUsername={invitedByUsername}
        invitedByEmail={invitedByEmail}
      />
    );

    console.log(emailHtml);

    // Send the email
    await sendEmail(
      email,
      `You're Invited to join ${orgName} on SmartMocks!`,
      emailHtml
    );

    return { success: true, message: "Invitation sent successfully" };
  } catch (error) {
    console.error("Error sending invitation:", error);
    return { success: false, message: "Failed to send invitation" };
  }
}

export async function acceptInvitation(userId: string, code: string) {
  const invitationRef = doc(db, "Invitations", code);
  const invitationDoc = await getDoc(invitationRef);

  if (invitationDoc.exists()) {
    await updateDoc(invitationRef, { status: "accepted" });
  }
}
