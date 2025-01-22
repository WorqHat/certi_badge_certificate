export interface UserData {
  email: string;
  name: string;
  role: string;
  photoUrl: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  phoneNumber: string;
  idNumber: string;
  personalId: string;
  branch: string;
  graduationYear: string;
  tagline: string;
  summary: string;
  skills: { value: string }[];
  orgRole: string;
  organizationRole: string;

  uid: string;
  rankScore: number;
  analysis: {
    attempted: number;
    avgScore: number;
    bestScore: number;
    worstScore: number;
    totalScore: number;
  };
  self_intro: {
    url: string;
    fileName: string;
  };
  attemptedQuestions?: string[];

  interviewsCount: number;
  creditBalance: number;

  showQuestion?: boolean;
  totalScore?: number;
}

export type UserDetails = {
  name: string;
  email: string;
};

export type certificateProps = {
  title: string;
  subtitle: string;
  context: string;
  issueDate: string;
  expiryDate: string;
  certificateId: string;
};

export interface CertificateProps {
  certificateRef?: React.RefObject<HTMLDivElement>;
  participant: UserDetails;
  certificateDetails: certificateProps;
}
