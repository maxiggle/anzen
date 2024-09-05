import useContract from "../../hooks/useContract";
import Button from "../UI/Button";
import config from "../../utils/config";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function CreateContract() {
  const { create, getContractContent } = useContract();

  const [contractContent, setContractContent] = useState("");
  const [contractTerms, setContractTerms] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const printTarget = useRef<HTMLDivElement>(null);

  // Function to handle creating a contract and fetching content
  async function handleCreateContractAndReturnContent(): Promise<void> {
    setIsGenerating(true);
    const contractId = await create(config.employeeAddress, contractTerms);
    if (contractId) {
      console.log("Contract created with ID:", contractId);
    } else {
      console.error("Failed to create contract.", status);
    }
    const content = await getContractContent(+contractId.toString() - 1);
    setContractContent(content);
    setIsGenerating(false);
  }

  useEffect(() => {
    if (isPrinting) {
      const printWindow = window.open("", "_blank");
      printWindow?.document.write(`
        <html>
          <head>
            <title>Employment Contract</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              h1 { text-align: center; }
            </style>
          </head>
          <body>
          <div style="text-align: center;">
              <a style="width: 220px; display: inline-flex; mergin-bottom: 8px">
                <img
                  src="/icons/hlogo.png"
                  alt="logo"
                  style="width:100%; height: auto; object-fit:cover"
                />
              </a>
            </div>
            <h1>Employment Offer</h1>
            <div>${printTarget.current?.innerHTML}</div>
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.print();
      setIsPrinting(false);
    }
  }, [isPrinting, contractContent, printTarget]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {contractContent === "" ? (
        <>
          <div>
            <h3 className="font-semibold mb-4 text-lg">Create Your Contract</h3>

            <div className="">
              <label className="block mb-2">Enter Your Terms:</label>
              <textarea
                className="w-full mb-3 p-3 border-2 rounded-lg"
                cols={4}
                rows={4}
                value={contractTerms}
                onChange={(e) => setContractTerms(e.target.value)}
              ></textarea>
            </div>
            <Button
              variant="primary"
              loading={isGenerating}
              onClick={() => handleCreateContractAndReturnContent()}
            >
              Generate
            </Button>
          </div>
        </>
      ) : (
        <div className="">
          <h2 className="text-xl font-semibold mb-4">Employment Contract</h2>
          <div
            ref={printTarget}
            className="border-2 contract border-gray-300 rounded-md p-4 mb-4"
          >
            <ReactMarkdown>{contractContent}</ReactMarkdown>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" loading={isGenerating} onClick={() => {}}>
              Sign Contract
            </Button>
            <Button
              variant="outline"
              loading={isGenerating}
              onClick={() => {
                handleCreateContractAndReturnContent();
              }}
            >
              Regenerate
            </Button>
            <Button
              loading={isPrinting}
              variant="primary"
              onClick={() => setIsPrinting(true)}
            >
              Print Contract
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
