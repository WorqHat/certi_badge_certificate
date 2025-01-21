import { db } from "@/database/firebaseConfig";
import { UserData } from "@/types/participant";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export const getUserRole = async (
  userId: string
): Promise<string | undefined> => {
  const userRef = doc(db, "WorqHat/Hackathon/Participants", userId);
  const docSnapshot = await getDoc(userRef);
  return docSnapshot.exists() ? docSnapshot.data().role : undefined;
};

export const getUserDetails = (
  userId: string,
  callback: (userData: UserData | null) => void
) => {
  const userRef = doc(db, "WorqHat/Hackathon/Participants", userId);

  if (!userId || typeof userId !== "string") {
    console.error("Invalid userId or orgId provided to getUserDetails");
    callback(null);
    return () => {}; // Return a no-op function as we're not setting up a listener in this case
  }

  return onSnapshot(
    userRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = {
          ...docSnapshot.data(),
          uid: docSnapshot.id,
        } as UserData;
        callback(userData);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error("Error listening to user details:", error);
      callback(null);
    }
  );
};
