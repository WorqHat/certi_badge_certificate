import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentHome = () => {
  const [certificateId, setCertificateId] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    navigate(`/view/${certificateId}`);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full space-y-6">
        <h1 className="text-2xl font-semibold text-center text-blue-600">
          Verify Your Credentials
        </h1>
        <p className="text-gray-600 text-center">
          Enter your Certificate ID below to check the validity of your
          credentials.
        </p>
        <div className="space-y-4">
          <Label
            htmlFor="certificate-id"
            className="block text-sm font-medium text-gray-700"
          >
            Certificate ID
          </Label>
          <Input
            id="certificate-id"
            className="shadow-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full p-3"
            placeholder="(e.g XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX )"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
          />
        </div>
        <Button
          onClick={handleVerify}
          className="w-full py-3 rounded-lg transition-transform transform hover:scale-105"
        >
          Verify Now
        </Button>
      </div>
    </div>
  );
};

export default StudentHome;
