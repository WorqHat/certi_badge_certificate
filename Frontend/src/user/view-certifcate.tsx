import { useEffect, useRef, useState } from "react";
import Certificate from "@/Certificate/certificate";
import { useParams } from "react-router-dom";
import { getCertificateDetails } from "@/database/storeEvent";
import Loader from "@/Loader/loader";
import { Button } from "@/components/ui/button";
import worqhatlogo from "@/assets/images/logo-blue.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { certificateProps } from "@/types/participant";
import Verification from "@/functions/verification";

const ViewCertificate = () => {
  const { certificateId } = useParams(); // Destructure the certificate ID
  const [certificateDetails, setCertificateDetails] =
    useState<certificateProps>();
  const [participant, setParticipant] = useState({ email: "", name: "" });
  const [loading, setLoading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCertificateDetails = async () => {
      setLoading(true);
      if (!certificateId) {
        console.error("Certificate ID is missing.");
        return;
      }

      const response = await getCertificateDetails(certificateId);
      if (response.success) {
        const details = response.data;

        // Set participant and certificate details in state
        setParticipant({
          email: details.awardeeEmail,
          name: details.awardeeName,
        });
        setCertificateDetails({
          title: details.certificateTitle,
          subtitle: details.certificateSubTitle,
          issueDate: details.certificateIssueDate,
          expiryDate: details.certificateExpiryDate,
          context: details.certificateContext,
          event: details.eventName,
          eventDetails: details.eventDetails,
          skills: details.skills,
          certificateId: details.awardId,
        });
      } else {
        console.error(response.message);
      }
      setLoading(false);
    };

    fetchCertificateDetails();
  }, [certificateId]);

  if (!certificateDetails || !participant) {
    return <div>Loading your Achievement...</div>;
  }

  const downloadCertificate = async () => {
    if (certificateRef.current) {
      // Convert Certificate to Canvas
      const canvas = await html2canvas(certificateRef.current, {
        useCORS: true, // To handle cross-origin images
      });

      // Get Canvas Dimensions
      const imgData = canvas.toDataURL("image/png");
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Initialize jsPDF in Landscape Mode with Dynamic Size
      const pdf = new jsPDF("landscape", "px", [canvasWidth, canvasHeight]);

      // Add Canvas Image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, canvasWidth, canvasHeight);

      // Save PDF
      pdf.save("certificate.pdf");
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="h-full bg-neutral-50 border rounded-lg">
          <div className="flex flex-col items-center justify-center h-full  rounded-lg">
            <img src={worqhatlogo} alt="worqhat logo" className="h-24 mb-2" />
            <h1 className="text-2xl font-bold mb-4">
              Acknowledging Your Success
            </h1>
          </div>
          <div>
            <Certificate
              certificateRef={certificateRef}
              participant={participant}
              certificateDetails={certificateDetails}
            />
            <Button className="mt-4 bg-blue-950" onClick={downloadCertificate}>
              {" "}
              Download Certificate
            </Button>
          </div>
          <div className="w-full flex mt-2">
            <div className="w-[500px] ">
              <div className="bg-white border m-2 rounded-lg">
                <h1 className="flex justify-start items-start ml-4 mt-2 font-bold text-blue-900 text-md ">
                  Issued To
                </h1>
                <h2 className="flex justify-center items-center text-xl mt-2 border rounded-lg mx-4 py-2">
                  {participant.name}
                </h2>
                <p className="mt-4 mb-2 ml-4 flex justify-start ">
                  Want to report typo or mistake
                </p>
                <a
                  href="https://discord.com/invite/KHh9mguKBx"
                  className="text-blue-900 flex justify-start items-start ml-4 mb-4 w-24"
                >
                  contact us
                </a>
              </div>
              <div className="bg-white border m-2 rounded-lg space-y-2 py-4 flex flex-col px-4 justify-start items-start">
                <h1 className="font-bold text-blue-900">
                  {" "}
                  Credential Information
                </h1>
                <p>Issue Date: {certificateDetails.issueDate}</p>
                <p>Expiration Date: {certificateDetails.expiryDate}</p>
                <Verification />
                <p className="text-blue-900 text-xs">
                  ID: {certificateId || certificateDetails.certificateId}
                </p>
              </div>
            </div>

            <div className="w-full bg-white border m-2 rounded-lg">
              {/* WorqHat Info */}
              <div>
                <div className="flex w-full justify-start text-md mt-4 ml-4 items-center  font-bold text-blue-900">
                  Issued by
                </div>

                <div className="flex w-full justify-start text-xl ml-4 my-2 items-center font-semibold ">
                  WorqHat
                </div>

                <div className="border-b pb-4 ">
                  <div className="flex w-full justify-start text-left ml-4">
                    WorqHat is a powerful and easy-to-use “No-Code drag & drop
                    Workspace” powered by Generative AI Technologies that lets
                    you build your own brandable Custom Solutions
                  </div>
                </div>
              </div>
              {/* end of WorqHat Info */}

              {/* Event Details */}
              <div>
                <div className="flex w-full justify-start text-md mt-4 ml-4 items-center font-bold text-blue-900">
                  Event Details
                </div>

                <div className="flex w-full justify-start text-xl ml-4 my-2 items-center font-semibold">
                  {certificateDetails.event}
                </div>

                <div className="border-b pb-4 ">
                  <div className="flex w-full justify-start text-left ml-4">
                    {certificateDetails.eventDetails}
                  </div>
                </div>
              </div>
              {/* End Event Details */}

              {/* Skills Section */}
              <div>
                <div className="flex w-full justify-start text-md mt-4 ml-4 items-center font-bold text-blue-900">
                  Certificate Awarded for
                </div>
                <div className="flex justify-start items-center m-4 space-x-4">
                  {certificateDetails.skills.split(",").map((skill, index) => (
                    <Button
                      key={index}
                      className="border w-auto rounded-xl shadow-md "
                      variant={"outline"}
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
              </div>
              {/* End Skills Section */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCertificate;
