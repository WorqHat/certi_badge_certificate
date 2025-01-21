import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface MembersInvitationEmailProps {
  emailAddress: string;
  invitationCode: string;
  orgName: string;
  invitedByUsername: string;
  invitedByEmail: string;
}

export const InternalInvitationEmail: React.FC<MembersInvitationEmailProps> = ({
  emailAddress,
  invitationCode,
  orgName,
  invitedByUsername,
  invitedByEmail,
}) => {
  const previewText = `You have been invited to join ${orgName} on SmartMocks!`;
  const inviteLink = `${window.location.protocol}//${window.location.host}/invite/${invitationCode}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`https://worqhat.com/resources/WorqHat%20TM%20Logo.png`}
                width="80%"
                height="auto"
                alt="WorqHat Logo"
                className="my-0 mx-auto"
                style={{ maxWidth: "170px" }}
              />
            </Section>
            <Heading className="text-blue-900 text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join <strong>{orgName}</strong> on <strong>SmartMocks</strong>
            </Heading>
            <Text className="text-blue-900 text-[16px] leading-[24px]">
              Hello {emailAddress},
            </Text>
            <Text className="text-blue-900 text-[16px] leading-[24px]">
              <strong>{invitedByUsername}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) has invited you to the <strong>{orgName}</strong> team on{" "}
              <strong>SmartMocks</strong>.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-blue-900 rounded text-white text-[20px] font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                Join the team
              </Button>
            </Section>
            <Text className="text-blue-900 text-[16px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This invitation was intended for{" "}
              <span className="text-blue-900">{emailAddress}</span>. If you were
              not expecting this invitation, you can ignore this email. If you
              are concerned about your account's safety, please reply to this
              email to get in touch with us.
            </Text>
          </Container>
          <Text className="text-gray-600 text-[12px] text-center">
            © {new Date().getFullYear()} WorqHat. All rights reserved.
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InternalInvitationEmail;
