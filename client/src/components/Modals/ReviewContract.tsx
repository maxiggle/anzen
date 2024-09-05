// import useContract from "../../hooks/useContract";
import Button from "../UI/Button";
// import config from "../../utils/config";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import useReviewContract from "../../hooks/useReviewContract";

export default function CreateContract() {
  const { reviewContract, getReviewedContent } = useReviewContract();
  const [contractContent, setContractContent] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const printTarget = useRef<HTMLDivElement>(null);

  async function handleReviewContractAndReturnContent(): Promise<void> {
    setIsReviewing(true);
    const contractId = await reviewContract(
      "6",
      "You are an expert AI lawyer hired by the employee to review their employment contract. Your task is to go through the contract line by line, explaining each clause in detail so that the employee can fully understand the terms and conditions. As you review the contract, identify and highlight any potential issues or clauses that could be unfavorable to the employee. Offer clear, unbiased advice on what each part means and how it might impact the employee's rights and obligations. Any other comments, reasoning, or dialogue that does not relate to explaining the contract should not be included."
    );
    console.log("contractId", contractId);
    const content = await getReviewedContent(+contractId.toString() - 1);
    setContractContent(content);
    setIsReviewing(false);
  }

  useEffect(() => {
    if (isPrinting) {
      const printWindow = window.open("", "_blank");
      printWindow?.document.write(`
        <html>
          <head>
            <title>Employment Contract Review</title>
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
            <h3 className="font-semibold mb-4 text-lg">Ask Anzen to review</h3>

            <div className="">
              <label className="block mb-2">
                Where do you need me to review:
              </label>
              <textarea
                className="w-full mb-3 p-3 border-2 rounded-lg"
                cols={4}
                rows={4}
              ></textarea>
            </div>
            <Button
              variant="primary"
              loading={isReviewing}
              onClick={() => handleReviewContractAndReturnContent()}
            >
              Generate
            </Button>
          </div>
        </>
      ) : (
        <div className="">
          <h2 className="text-xl font-semibold mb-4">
            Employment Contract Review
          </h2>
          <div
            ref={printTarget}
            className="border-2 contract border-gray-300 rounded-md p-4 mb-4"
          >
            <ReactMarkdown>{contractContent}</ReactMarkdown>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" loading={isReviewing} onClick={() => {}}>
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
