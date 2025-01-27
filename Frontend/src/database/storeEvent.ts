import { certificateProps, UserDetails } from "@/types/participant";
import { db } from "@/database/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const storeEvent = async (
  participant: UserDetails,
  certificateDetails: certificateProps
): Promise<{ success: boolean; message: string; awardId: string }> => {
  try {
    // Generate a unique ID for the award
    const awardId = uuidv4();
    const awardRef = doc(db, "WorqHat/Hackathon/Awardees", awardId);

    // Define the award data structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const awardData: Record<string, any> = {
      awardId,
      awardeeName: participant.name,
      awardeeEmail: participant.email,
      certificateId: awardId,
      certificateTitle: certificateDetails.title,
      certificateSubTitle: certificateDetails.subtitle,
      certificateIssueDate: certificateDetails.issueDate,
      certificateExpiryDate: certificateDetails.expiryDate,
      certificateContext: certificateDetails.context,
      eventName: certificateDetails.event,
      eventDetails: certificateDetails.eventDetails,
      skills: certificateDetails.skills,
    };

    // Save the award data to Firestore
    await setDoc(awardRef, awardData);

    return {
      success: true,
      message: "Award data stored successfully.",
      awardId: awardId,
    };
  } catch (error) {
    console.error("Error storing award data:", error || error);
    return {
      success: false,
      message: `Failed to store award data: ${error || error}`,
      awardId: "invalid",
    };
  }
};

export const getCertificateDetails = async (
  certificateId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    // Reference to the certificate document
    const certificateRef = doc(db, "WorqHat/Hackathon/Awardees", certificateId);

    // Fetch the document
    const certificateSnapshot = await getDoc(certificateRef);

    // Check if the document exists
    if (certificateSnapshot.exists()) {
      return {
        success: true,
        data: certificateSnapshot.data(),
      };
    } else {
      return {
        success: false,
        message: "Certificate not found. Please check the certificate ID.",
      };
    }
  } catch (error) {
    console.error("Error fetching certificate details:", error || error);
    return {
      success: false,
      message: `Failed to fetch certificate details: ${error || error}`,
    };
  }
};
