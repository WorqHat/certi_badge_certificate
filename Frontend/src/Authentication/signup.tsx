import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { BrandingBadge } from "@/components/worqhat-badge";
import { EyeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/database/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { createAccount } from "@/functions/create-account";
import { toast } from "sonner";
import { render } from "@react-email/render";
import Loader from "@/Loader/loader";

import worqhatlogo from "@/assets/images/logo-blue.png";
import { OTPModal } from "./input-otp-modal";
import SignupConfirmationEmail from "@/Templates/Mails/signup";

// async function sendEmail(to: string, subject: string, html: string) {
//   try {
//     const response = await fetch(
//       `${import.meta.env.VITE_BACKEND_URL}/api/emails/send-email/processor`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           mailTo: [to],
//           subject: subject,
//           mailBody: html,
//           mailFrom: "Interview AI <interviews@updates.worqhat.com>",
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to send email");
//     }

//     const data = await response.json();
//     console.log("Email sent:", data);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// }

export default function Signup() {
  const pageTitle = `Tables | Signup`;
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      setIsAuthenticated(!!user);
      if (isAuthenticated) {
        navigate("/admin-home");
      } else {
        setIsLoading(false);
      }
    });
  });

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  async function handleSignup() {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const result = await createAccount(
        email,
        user.uid,
        user.photoURL || "",
        name
      );
      if (result.success) {
        console.log(result.message);

        // Render the email
        const emailHtml = await render(
          <SignupConfirmationEmail
            name={name.includes(" ") ? name.split(" ")[0] : name}
          />
        );

        // Send the email
        // await sendEmail(
        //   email,
        //   `🚀 Your Preparation for the Big Interview Begins!`,
        //   emailHtml
        // );

        toast.success(
          "Account created successfully! Please check your email to confirm your account."
        );

        const searchParams = new URLSearchParams(location.search);
        const redirectTo = searchParams.get("redirect");
        if (redirectTo) {
          navigate(decodeURIComponent(redirectTo));
        } else {
          navigate("/");
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        switch (error.name) {
          case "FirebaseError":
            // Handle Firebase Auth errors
            switch ((error as { code?: string }).code) {
              case "auth/email-already-in-use":
                toast.error(
                  "The provided email is already in use by an existing user."
                );
                break;
              case "auth/invalid-email":
                toast.error("The provided email is invalid.");
                break;
              case "auth/weak-password":
                toast.error(
                  "The provided password is too weak. Please choose a stronger password."
                );
                break;
              default:
                toast.error("Signup failed. Please try again.");
                break;
            }
            break;
          default:
            // Handle other errors (including the one thrown from createAccount)
            toast.error(error.message || "Signup failed. Please try again.");
            break;
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setName("");
      setEmail("");
      setPassword("");
    }
  }

  async function handleGoogleSignin() {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if this is a new user
      const accountResult = await createAccount(
        user.email || "",
        user.uid,
        user.photoURL || "",
        user.displayName || ""
      );
      if (!accountResult.success) {
        throw new Error(accountResult.message);
      }

      const emailHtml = await render(
        <SignupConfirmationEmail
          name={
            user.displayName?.includes(" ")
              ? user.displayName?.split(" ")[0]
              : user.displayName || ""
          }
        />
      );

      // Send the email
      // if (user.email) {
      //   await sendEmail(
      //     user.email,
      //     `🚀 Your Preparation for the Big Interview Begins!`,
      //     emailHtml
      //   );
      // }

      toast.success(
        "Account created successfully! Please check your email to confirm your account."
      );

      // Navigate after successful sign-up/sign-in
      const searchParams = new URLSearchParams(location.search);
      const redirectTo = searchParams.get("redirect");
      if (redirectTo) {
        navigate(decodeURIComponent(redirectTo));
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      if (error instanceof Error) {
        toast.error(
          error.message ||
            "Sign-in failed. Please try again or contact support."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <OTPModal />
      <div className="fixed bottom-0 right-20">
        <BrandingBadge />
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={worqhatlogo}
                alt="Company Logo"
                className="absolute left-10 top-10 h-12 w-auto"
              />
            </Link>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Create an account</h2>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="*************"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                required
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-1 right-1 h-7 w-7"
                onClick={() => setShowPassword(!showPassword)}
              >
                <EyeIcon className="h-4 w-4" />
                <span className="sr-only">Toggle password visibility</span>
              </Button>
            </div>
            <Button className="w-full" onClick={handleSignup}>
              Sign Up
            </Button>
            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              className="w-full"
              onClick={handleGoogleSignin}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}{" "}
              Continue with Google
            </Button>
          </div>
          <div className="text-center text-xs text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link
              to="https://www.worqhat.com/terms-of-service"
              className="underline underline-offset-4"
            >
              Terms of Service{" "}
            </Link>
            and{" "}
            <Link
              to="https://www.worqhat.com/privacy-policy"
              className="underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
