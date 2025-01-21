import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import bgImage from "@/assets/images/bg-image.png";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { auth } from "@/database/firebaseConfig";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { createAccount } from "@/functions/create-account";
import { BrandingBadge } from "@/components/worqhat-badge";
import { Icons } from "@/components/icons";
import worqhatlogo from "@/assets/images/logo-blue.png";
import Loader from "@/Loader/loader";

export default function Signin() {
  const pageTitle = `Tables | Login`;
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  function handleLogin() {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        const searchParams = new URLSearchParams(location.search);
        const redirectTo = searchParams.get("redirect");
        if (redirectTo) {
          navigate(decodeURIComponent(redirectTo));
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/email-already-exists":
            setError(
              "The provided email is already in use by an existing user."
            );
            break;
          case "auth/invalid-credential":
            setError("Invalid email or password");
            break;
          case "auth/invalid-email":
            setError("The provided email is invalid.");
            break;
          case "auth/user-not-found":
            setError("No user found with this email.");
            break;
          case "auth/wrong-password":
            setError("Incorrect password, please try again.");
            break;
          case "auth/too-many-requests":
            setError("Too many requests. Please try again later.");
            break;
          default:
            setError("Login failed. Please try again.");
            break;
        }
        setIsLoading(false); // Ensure loading is set to false after handling errors
      })
      .finally(() => {
        setIsLoading(false);
        setEmail("");
        setPassword("");
      });
  }

  async function handleGoogleLogin() {
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

  async function handleForgotPassword() {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }

    setIsLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setIsLoading(false);
        setSuccess("Password reset email sent successfully.");
      })
      .catch((error) => {
        console.log("error", error);
        switch (error.code) {
          case "auth/invalid-email":
            setError("The provided email is invalid.");
            break;
          case "auth/user-not-found":
            setError("Email not found. Please try again.");
            break;
          default:
            setError("Failed to send password reset email. Please try again.");
            break;
        }
        setIsLoading(false);
      });
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className="fixed bottom-0 right-20">
        <BrandingBadge />
      </div>
      <div className="w-full lg:grid h-screen lg:grid-cols-2 overflow-hidden">
        <div className="hidden bg-muted lg:block">
          <img
            src={bgImage}
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
          <img
            src={worqhatlogo}
            alt="Company Logo"
            className="absolute left-10 top-10 h-12 w-auto"
          />
        </div>
        <div className="flex items-center justify-center h-screen">
          <img
            src={worqhatlogo}
            alt="Company Logo"
            className="lg:hidden absolute left-10 top-10 h-12 w-auto"
          />
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@youremail.in"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <p
                    className="ml-auto inline-block text-sm underline cursor-pointer"
                    onClick={handleForgotPassword}
                  >
                    Forgot your password?
                  </p>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="**********"
                  required
                />
              </div>
              <Button
                type="button"
                className="w-full"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Logging In ....
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={handleGoogleLogin}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.google className="mr-2 h-4 w-4" />
                )}{" "}
                Google
              </Button>
            </div>
            {error && <AlertDestructive message={error} />}
            {success && <AlertSuccess message={success} />}
            <p className="text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <a
                href="https://www.worqhat.com/terms-of-service"
                className="underline underline-offset-4 hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://www.worqhat.com/privacy-policy"
                className="underline underline-offset-4 hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              .
            </p>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <p
                className="underline cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign up here !!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function AlertDestructive({ message }: { message: string }) {
  return (
    <Alert
      variant="destructive"
      className="text-red-600 dark:text-red-400 text-xs"
    >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export function AlertSuccess({ message }: { message: string }) {
  return (
    <Alert
      variant="default"
      className="text-green-600 dark:text-green-400 text-xs"
    >
      {message}
    </Alert>
  );
}
