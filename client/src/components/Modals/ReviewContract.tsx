// import useContract from "../../hooks/useContract";
import Button from "../UI/Button";
// import config from "../../utils/config";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import useReviewContract from "../../hooks/useReviewContract";
import { ContractData } from "../../utils/types";

export default function ReviewContract({
  contract,
}: {
  contract: ContractData;
}) {
  const { reviewContract, getReviewedContent, approveContract } =
    useReviewContract();
  const [contractContent, setContractContent] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const printTarget = useRef<HTMLDivElement>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [reviewId, setReviewId] = useState(0);
  const [userInput, setUserInput] = useState("");
  const promptTemplate = `You are an expert AI lawyer specializing in employment law, Your responses consist of valid law responses, with no other comments, explanations, reasoning, or dialogue not consisting of contract law reviews.\n
  
  1. Analyze the contract thoroughly, explaining each clause in detail to ensure the employee's full understanding.
  2. Identify and highlight any potential issues or clauses that could be unfavorable to the employee.
  3. Provide clear, unbiased advice on the meaning and impact of each part of the contract on the employee's rights and obligations.
  4. Address any specific queries or concerns raised by the employee in their input.
  
  Guidelines:
  - Maintain a professional and impartial tone throughout your analysis.
  - Focus solely on explaining and analyzing the contract; avoid any unrelated comments or dialogue.
  - If the employee has provided a specific query or area of concern, prioritize addressing that in your response.
  - If no specific query is provided, proceed with a comprehensive review of the entire contract.
  - Use clear, concise language to ensure accessibility for non-legal professionals.
  - When highlighting potential issues, explain why they might be problematic and suggest areas for negotiation or clarification.
  - Do not recommend users to ask legal advice from a lawyer because you are meant to be the lawyer.
  
  Remember: Your goal is to empower the employee with a thorough understanding of their employment contract, enabling them to make informed decisions.
  
  User Input (if any): {userInput}
  
  Please begin your analysis based on the above instructions and any specific user input provided.`;
  async function handleReviewContractAndReturnContent(): Promise<void> {
    if (!contract) {
      console.error("Contract is undefined");
      return alert("Contract is not set");
    }

    setIsReviewing(true);
    const contractId = await reviewContract(
      Number(contract.contractId),
      promptTemplate
    );
    setReviewId(+contractId.toString());
    console.log("contractId", +contractId.toString());
    const content = await getReviewedContent(+contractId.toString() - 1);
    console.log("content", content);
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

  if (!contract) {
    return <div>Loading...</div>;
  }

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
              <div
                ref={printTarget}
                className="border-2 contract border-gray-300 max-h-[60vh] overflow-y-auto rounded-md p-4 mb-4"
              >
                <ReactMarkdown>
                  {contractContent || contract.contractContent}
                </ReactMarkdown>
              </div>

              <textarea
                className="w-full mb-3 p-3 border-2 rounded-lg"
                cols={4}
                rows={4}
                placeholder="Ask AI about the contract"
                onChange={(e) => setUserInput(e.target.value)}
                value={userInput}
              ></textarea>
            </div>
            <div className="flex flex-row gap-3">
              <Button
                variant="outline"
                loading={isReviewing}
                onClick={() => handleReviewContractAndReturnContent()}
              >
                Generate
              </Button>
            </div>
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
            <Button
              onClick={() => approveContract(reviewId, isApproved)}
              variant="primary"
              onChange={() => {
                setIsApproved(true);
              }}
            >
              Approve
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
