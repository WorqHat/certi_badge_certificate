import { db } from "@/database/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const createAccount = async (
  email: string,
  userId: string,
  photoUrl: string,
  name: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if the user already exists
    const userRef = doc(db, "WorqHat/Hackathon/Participants", userId);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      // User already exists, skip the addition process
      return { success: true, message: "User already exists" };
    }

    // User doesn't exist, proceed with creating a new user
    const nameParts = name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    const newUser = {
      email,
      photoUrl,
      name,
      role: "student",
      firstName,
      lastName,
    };

    await setDoc(userRef, newUser);

    return { success: true, message: "Account created successfully" };
  } catch (error) {
    console.error("Error creating account:", error);
    return { success: false, message: "Failed to create account" };
  }
};
