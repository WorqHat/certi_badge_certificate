import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface FeatureProps {
  steps?: {
    id: number;
    Description: React.ReactNode;
  }[];
  links?: {
    text: string;
    href: string;
  }[];
}

interface SignupConfirmationEmailProps {
  name: string;
  steps?: FeatureProps["steps"];
  links?: FeatureProps["links"];
}

const PropDefaults: FeatureProps = {
  steps: [
    {
      id: 1,
      Description: (
        <li className="mb-20" key={1}>
          <strong>Set up your profile and preferences.</strong>{" "}
          <Link href={`${window.location.origin}/profile`}>
            Complete your profile
          </Link>{" "}
          with your background, skills, and target industries. This helps us
          tailor the interview experience to your needs.
        </li>
      ),
    },
    {
      id: 2,
      Description: (
        <li className="mb-20" key={2}>
          <strong>
            Choose from a variety of interview types and industries.
          </strong>{" "}
          Select from technical interviews, behavioral interviews, case studies,
          and more. Customize your practice sessions based on your career goals.{" "}
          <Link href={`${window.location.origin}/`}>
            Explore interview options
          </Link>
          .
        </li>
      ),
    },
    {
      id: 3,
      Description: (
        <li className="mb-20" key={3}>
          <strong>Practice with AI-powered mock interviews.</strong> Engage in
          realistic interview scenarios with our advanced AI interviewer.
          Improve your skills in a low-pressure environment.{" "}
          <Link href={`${window.location.origin}/interviews`}>
            Start your first mock interview
          </Link>
          .
        </li>
      ),
    },
    {
      id: 4,
      Description: (
        <li className="mb-20" key={4}>
          <strong>Receive instant feedback and improvement suggestions.</strong>{" "}
          Get detailed analysis of your performance, including communication
          skills, technical accuracy, and areas for improvement.{" "}
          <Link href={`${window.location.origin}/interviews`}>
            Learn how to interpret your feedback
          </Link>
          .
        </li>
      ),
    },
    {
      id: 5,
      Description: (
        <li className="mb-20" key={5}>
          <strong>Track your progress and set new goals.</strong> Monitor your
          performance over time and set new goals to keep improving.{" "}
          <Link href={`${window.location.origin}/reports`}>
            View your progress
          </Link>
          .
        </li>
      ),
    },
  ],
  links: [
    { text: "Try an Interview", href: `${window.location.origin}/` },
    {
      text: "Complete your profile",
      href: `${window.location.origin}/profile`,
    },
    {
      text: "View your progress",
      href: `${window.location.origin}/interviews`,
    },
  ],
};

export const SignupConfirmationEmail: React.FC<
  SignupConfirmationEmailProps
> = ({ name, steps = PropDefaults.steps, links = PropDefaults.links }) => {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to WorqHat AI Interview - Your path to interview success!
      </Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#2250f4",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Body className="bg-offwhite text-base font-sans">
          <Img
            src={`https://interview.worqhat.app/assets/logo-blue-CHrj5tK4.png`}
            width="184"
            height="75"
            alt="Netlify"
            className="mx-auto my-20"
          />
          <Container className="bg-white p-45">
            <Heading className="text-center my-0 leading-8">
              Welcome to WorqHat AI Interview
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">Hi {name},</Text>

                <Text className="text-base">
                  Congratulations on taking the first step towards mastering
                  your interview skills! You're joining over 2 thousand
                  developers around the world who use WorqHat AI Interview to
                  practice and excel in their upcoming interviews.
                </Text>

                <Text className="text-base">Here's how to get started:</Text>
              </Row>
            </Section>

            <ul>{steps?.map(({ Description }) => Description)}</ul>

            <Section className="text-center">
              <Link
                href={`${window.location.origin}/profile`}
                target="_blank"
                className="bg-brand text-white rounded-lg py-3 px-[18px] font-bold no-underline text-center"
              >
                Go to your dashboard
              </Link>
            </Section>

            <Section className="mt-45">
              <Row>
                {links?.map((link) => (
                  <Column key={link.text}>
                    <Link
                      href={link.href}
                      className="text-black underline font-bold"
                    >
                      {link.text}
                    </Link>{" "}
                    <span className="text-green-500">→</span>
                  </Column>
                ))}
              </Row>
            </Section>
          </Container>

          <Container className="mt-20">
            <Text className="text-center text-gray-400 mb-45">
              WorqHat, 11CoWork, Spot18 Mall, Pune, India
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default SignupConfirmationEmail;
