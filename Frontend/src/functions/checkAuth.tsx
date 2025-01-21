import { useEffect, useState, ComponentType } from "react";
import {
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth, db } from "@/database/firebaseConfig";
import { Navigate, useNavigate } from "react-router-dom";
import Loader from "@/Loader/loader";
import { getUserRole } from "@/database/getUserDetails";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withAuthCheck(Component: ComponentType<any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function AuthWrappedComponent(props: any) {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string | undefined>(undefined);

    const navigate = useNavigate();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log(user.uid);
          // Check if user exists in the organization's users subcollection
          const userDocRef = doc(
            db,
            `WorqHat/Hackathon/Participants`,
            user.uid
          );
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setIsAuthenticated(true);
            const role = await getUserRole(user.uid);
            setUserRole(role);
          } else {
            // User is not part of this organization
            setIsAuthenticated(false);
            setUserRole(undefined);
            // Sign out the user
            await signOut(auth);
            // Redirect to login page
            navigate("/login");
            // Show Sonner alert
            toast.error("You are not a member of this organization.", {
              description: "Please contact your administrator for access.",
              duration: 5000,
            });
          }
        } else {
          setIsAuthenticated(false);
          setUserRole(undefined);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }, [navigate]);

    if (loading) {
      return <Loader />;
    }

    if (!isAuthenticated) {
      const redirectTo = encodeURIComponent(location.pathname);
      return <Navigate to={`/login?redirect=${redirectTo}`} />;
    }

    // Pass userRole as a prop to the Component
    return <Component {...props} userRole={userRole} />;
  };
}

export const handleLogout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    console.error(error);
  }
};

export async function reauthenticateWithPassword(
  currentUser: User,
  password: string
): Promise<void> {
  const email = currentUser.email;

  if (email) {
    // Check if email is not null
    const credential = EmailAuthProvider.credential(email, password);
    try {
      await reauthenticateWithCredential(currentUser, credential);
    } catch (error: unknown) {
      if ((error as { code?: string }).code === "auth/wrong-password") {
        throw new Error("Incorrect password");
      } else {
        throw error;
      }
    }
  } else {
    throw new Error("Current user email is null");
  }
}

export async function sendPasswordReset(
  emailAddress: string
): Promise<boolean> {
  try {
    await sendPasswordResetEmail(auth, emailAddress);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return false;
  }
}

export default withAuthCheck;
