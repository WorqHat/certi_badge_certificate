import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, CircleCheck } from "lucide-react";
import { useState } from "react";

const Verification = () => {
  const [step, setStep] = useState(0); // Tracks the current step (0 = no step, 1, 2, 3 for each step)
  const [verified, setVerified] = useState(false);

  const handleVerification = () => {
    setStep(0); // Reset to initial state
    setVerified(false);

    setTimeout(() => {
      setStep(1); // First step after 1s
      setTimeout(() => {
        setStep(2); // Second step after another 2s
        setTimeout(() => {
          setStep(3); // Third step after another 2s
          setTimeout(() => setVerified(true), 1000); // Show alert after another 2s
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={handleVerification}
          className="w-full mr-4 bg-blue-950"
        >
          Verify Credentials
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Credential Verification</DialogTitle>
        </DialogHeader>
        <div className="timeline">
          {/* Timeline Section */}
          <div className="flex flex-col space-y-6 my-4">
            <div className="flex items-center">
              <div
                className={`h-6 w-6 flex justify-center items-center rounded-full border-2 ${
                  step >= 1
                    ? "border-green-600 bg-green-100"
                    : "border-gray-300 bg-gray-100"
                }`}
              >
                {step > 1 ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <span className="text-sm font-medium text-gray-800">1</span>
                )}
              </div>
              <p className="ml-3">Verifying the recipient...</p>
            </div>
            <div className="flex items-center mb-2">
              <div
                className={`h-6 w-6 flex justify-center items-center rounded-full border-2 ${
                  step >= 2
                    ? "border-green-600 bg-green-100"
                    : "border-gray-300 bg-gray-100"
                }`}
              >
                {step > 2 ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <span className="text-sm font-medium text-gray-800">2</span>
                )}
              </div>
              <p className="ml-3">Verifying the issuer...</p>
            </div>
            <div className="flex items-center mb-4">
              <div
                className={`h-6 w-6 flex justify-center items-center rounded-full border-2 ${
                  step >= 3
                    ? "border-green-600 bg-green-100"
                    : "border-gray-300 bg-gray-100"
                }`}
              >
                {step >= 3 ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <span className="text-sm font-medium text-gray-800">3</span>
                )}
              </div>
              <p className="ml-3">Verifying the credentials...</p>
            </div>
          </div>
        </div>
        {/* Alert Section */}
        {verified && (
          <Alert className="flex flex-col justify-center items-center">
            <AlertTitle className="flex flex-col justify-center items-center">
              <CircleCheck className="h-6 w-6 mb-2 text-green-600" />
              This is a valid credential
            </AlertTitle>
            <AlertDescription className="flex flex-col justify-center items-center text-center">
              This credential was securely issued via WorqHat.
              <br /> All the displayed information is valid.
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Verification;
