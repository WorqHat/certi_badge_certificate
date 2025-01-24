import { useEffect, useRef, useState } from "react";
import Certificate from "@/Certificate/certificate";
import { useParams } from "react-router-dom";
import { getCertificateDetails } from "@/database/storeEvent";
import Loader from "@/Loader/loader";
import { Button } from "@/components/ui/button";
import worqhatlogo from "@/assets/images/logo-blue.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ViewCertificate = () => {
  const { certificateId } = useParams(); // Destructure the certificate ID
  const [certificateDetails, setCertificateDetails] = useState({
    title: "",
    subtitle: "",
    issueDate: "",
    expiryDate: "",
    context: "",
    certificateId: "",
  });
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
    return <div>Loading certificate details...</div>;
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
          <div className="flex flex-col items-center justify-center h-full pt-12 rounded-lg">
            <h1 className="text-2xl font-bold mb-4">
              Certificate of Exellence
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
          <div className="w-full flex mt-12">
            <div className="w-[500px] ">
              <div className="bg-white border m-2 rounded-lg">
                <h1 className="flex justify-start items-start ml-4 mt-2 text-blue-400 text-lg font-semibold">
                  Issued To
                </h1>
                <h2 className="flex justify-center items-center text-xl mt-2 border rounded-lg mx-4 py-2">
                  {participant.name}
                </h2>
                <p className="mt-4 mb-2 ml-4 flex justify-start ">
                  Want to report typo or mistake
                </p>
                <a
                  href="https://worqhat.com/contact-us"
                  className="text-blue-500 flex justify-start items-start ml-4 mb-4 w-24"
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
                <Button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="w-full mr-4 bg-blue-950"
                >
                  Verify Credentials
                </Button>
                <p className="text-blue-900 text-xs">
                  ID: {certificateId || certificateDetails.certificateId}
                </p>
              </div>
            </div>

            <div className="w-full bg-white border m-2 rounded-lg">
              <img src={worqhatlogo} alt="worqhat logo" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCertificate;
