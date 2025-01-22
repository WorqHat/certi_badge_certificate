import { useLocation } from "react-router-dom";
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

const Preview = () => {
  const location = useLocation();
  const { participants = [], certificateDetails = {} } = location.state || {};

  const [selectedParticipant, setSelectedParticipant] = useState("");

  const participant = participants.find(
    (p: UserDetails) => p.email === selectedParticipant
  );

  return (
    <div className="h-full bg-neutral-50 border rounded-lg">
      <div className="flex flex-col items-center justify-center h-full p-12 rounded-lg">
        <h1 className="text-2xl font-bold mb-8">Preview Certificate Details</h1>
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
        </div>
      </div>
    </div>
  );
};

export default Preview;
