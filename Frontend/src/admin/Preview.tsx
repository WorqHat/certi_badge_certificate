import { useLocation, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import Certificate from "@/Certificate/certificate";
import { UserDetails } from "@/types/participant";
import { Button } from "@/components/ui/button";
import Loader from "@/Loader/loader";
import { storeEvent } from "@/database/storeEvent";
import sendInvitationEmail from "@/functions/send-email";

const Preview = () => {
  const location = useLocation();
  const { participants = [], certificateDetails = {} } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const navigate = useNavigate();
  const participant = participants.find(
    (p: UserDetails) => p.email === selectedParticipant
  );

  const issueCertificates = async () => {
    try {
      setLoading(true);
      console.log("Issuing certificates...");

      // Use Promise.all to handle the array of promises returned by the map function
      await Promise.all(
        participants.map(async (participant: UserDetails) => {
          const stored = await storeEvent(participant, certificateDetails);
          if (stored.success) {
            await sendInvitationEmail(
              { ...certificateDetails, certificateId: stored.awardId },
              participant,
              "support@worqhat.com",
              "WorqHat"
            );
          }
        })
      );

      console.log("Certificates issued successfully.");
      navigate("/admin-home");
    } catch (error) {
      console.error("Error issuing certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-neutral-50 border rounded-lg">
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-12 rounded-lg">
          <h1 className="text-2xl font-bold mb-8">
            Preview Certificate Details
          </h1>
          <div className="space-y-4">
            <div className="flex justify-center items-center">
              <Select
                onValueChange={(value) => setSelectedParticipant(value)}
                value={selectedParticipant}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Participant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Participants</SelectLabel>
                    {participants.map(
                      (participant: UserDetails, index: number) => (
                        <SelectItem key={index} value={participant.email}>
                          {participant.email}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {selectedParticipant && participant && (
              <Certificate
                participant={participant}
                certificateDetails={certificateDetails}
              />
            )}

            <Button onClick={issueCertificates}>Issue Credentials</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
