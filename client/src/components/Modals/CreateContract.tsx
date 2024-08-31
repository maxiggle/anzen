import useContract from "../../hooks/useContract";
import Button from "../UI/Button";
import config from "../../utils/config";
import { useState, useEffect } from "react";

export default function CreateContract() {
  const { create, getContractContent } = useContract();
  const [contractContent, setContractContent] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);

  async function handleCreateContractAndReturnContent(): Promise<void> {
    const contractId = await create(
      config.employeeAddress,
      "Position: Software Engineer; Salary: $100,000; Start Date: 2024-09-01"
    );
    const content = await getContractContent(+contractId.toString() - 1);
    setContractContent(content);
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
            <h1>Employment Contract</h1>
            <pre>${contractContent}</pre>
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.print();
      setIsPrinting(false);
    }
  }, [isPrinting, contractContent]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Button
        variant="plain"
        onClick={() => handleCreateContractAndReturnContent()}
      >
        Generate Contract
      </Button>

      {contractContent && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-4">Employment Contract</h2>
          <div className="border-2 border-gray-300 rounded-md p-4 mb-4 whitespace-pre-wrap">
            {contractContent}
          </div>
          <div className="flex justify-end">
            <Button variant="plain" onClick={() => setIsPrinting(true)}>
              Print Contract
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
