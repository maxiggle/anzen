const { ethers } = require("ethers");
require("dotenv").config();

const employeeAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "initialOracleAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_employerContractAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_textStorageAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "employerContractId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "reviewId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isApproved",
        type: "bool",
      },
    ],
    name: "ContractReviewed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Log",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newOracleAddress",
        type: "address",
      },
    ],
    name: "OracleAddressUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "reviewId",
        type: "uint256",
      },
    ],
    name: "ReviewContractCalled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "reviewId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "extractedText",
        type: "string",
      },
    ],
    name: "TextExtracted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reviewId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "approval",
        type: "bool",
      },
    ],
    name: "approveContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "contractReviews",
    outputs: [
      {
        internalType: "address",
        name: "employee",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "employerContractId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "review",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isApproved",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "messagesCount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isTextExtraction",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "employerContractAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "contractid",
        type: "uint256",
      },
    ],
    name: "extractTextFromGeneratedContract",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reviewId",
        type: "uint256",
      },
    ],
    name: "getExtractedText",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reviewId",
        type: "uint256",
      },
    ],
    name: "getMessageHistory",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "role",
            type: "string",
          },
          {
            components: [
              {
                internalType: "string",
                name: "contentType",
                type: "string",
              },
              {
                internalType: "string",
                name: "value",
                type: "string",
              },
            ],
            internalType: "struct IOracle.Content[]",
            name: "content",
            type: "tuple[]",
          },
        ],
        internalType: "struct IOracle.Message[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reviewId",
        type: "uint256",
      },
    ],
    name: "getReviewContent",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "runId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "string",
            name: "functionName",
            type: "string",
          },
          {
            internalType: "string",
            name: "functionArguments",
            type: "string",
          },
          {
            internalType: "uint64",
            name: "created",
            type: "uint64",
          },
          {
            internalType: "string",
            name: "model",
            type: "string",
          },
          {
            internalType: "string",
            name: "systemFingerprint",
            type: "string",
          },
          {
            internalType: "string",
            name: "object",
            type: "string",
          },
          {
            internalType: "uint32",
            name: "completionTokens",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "promptTokens",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "totalTokens",
            type: "uint32",
          },
        ],
        internalType: "struct IOracle.OpenAiResponse",
        name: "response",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "errorMessage",
        type: "string",
      },
    ],
    name: "onOracleOpenAiLlmResponse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "oracleAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "employerContractId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "query",
        type: "string",
      },
    ],
    name: "reviewContract",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOracleAddress",
        type: "address",
      },
    ],
    name: "setOracleAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "textStorageAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "contractId",
        type: "uint256",
      },
    ],
    name: "viewGeneratedContract",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const PRIVATE_KEY = process.env.PRIVATE_KEY_GALADRIEL;
const contractAddress = "0x87a70565A531Fbf986b955c92BC7bEc860c7461B";
const RPC_URL = "https://devnet.galadriel.com/"
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const employeeAddress = "0xb8FCeb74C6c7e9DEaAcE41060747670d43475997";

const employeeContract = new ethers.Contract(
  contractAddress,
  employeeAbi,
  wallet
);

async function reviewContract(employerContractId, query) {
  // Call the contract function and wait for the transaction to be mined
  const tx = await employeeContract.reviewContract(employerContractId, query);

  // Wait for the transaction to be confirmed
  const receipt = await tx.wait();

  const events = receipt.logs
    .map((log) => {
      try {
        return employeeContract.interface.parseLog(log);
      } catch (e) {
        return null;
      }
    })
    .filter((e) => e !== null);
  // Assuming the function returns a uint256 (reviewId), capture it directly
  console.log(events);
  const reviewId = events[0].args[0];
  console.log("contract reviewed", reviewId);
  return reviewId;
}
async function getReviewContent(reviewId) {
  const content = await employeeContract.getReviewContent(reviewId);
  console.log(content);
  return content;
}

async function viewGeneratedContract(contractId) {
  const content = await employeeContract.viewGeneratedContract(contractId);
  console.log(content);
  return content;
}

async function extractTextFromGeneratedContract(contractId) {
  const tx = await employeeContract.extractTextFromGeneratedContract(
    contractId
  );
  const receipt = await tx.wait();
  console.log("Transaction mined:", receipt);
  return receipt;
}

async function getExtractedText(contractId) {
  const content = await employeeContract.getExtractedText(contractId);
  // const receipt = await content.wait();
  console.log("the content is ", content);
  return content;
}

async function main() {
  // const reviewId = await reviewContract(2, "You are an expert AI lawyer hired by the employee to review their employment contract. Your task is to go through the contract line by line, explaining each clause in detail so that the employee can fully understand the terms and conditions. As you review the contract, identify and highlight any potential issues or clauses that could be unfavorable to the employee. Offer clear, unbiased advice on what each part means and how it might impact the employee's rights and obligations. Any other comments, reasoning, or dialogue that does not relate to explaining the contract should not be included.");
  // const content = await viewGeneratedContract(2);
  // console.log("the content is ", content);
  await getReviewContent(4);
  // await extractTextFromGeneratedContract(1);

  // Add a delay to allow time for the extraction process
  // console.log("Waiting for extraction to complete...");
  // await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds delay

  // const extractedText = await getExtractedText(2);
  // console.log("Extracted text:", extractedText);
}

// employeeContract.on("TextExtracted", (reviewId, extractedText) => {
//   console.log(`Text extracted for review ${reviewId}:`, extractedText);
// });

// async function main() {
 
// //  console.log(content);
//   // const id =  await reviewContract(1, "review this contract and explain all the terms in details");
//   // console.log("reviewed content:", content)
// const tx = await extractTextFromGeneratedContract(1);
// console.log("extracted text:", tx)
// //  console.log("extracted text:", text)
// //  console.log("extracted text:", content)
// //  const review = await getReviewContent(4);
// //  console.log("review content:", review)
//   const extractedText = await getExtractedText(2);
//   console.log("extracted text:", extractedText)

// }

main().catch(console.error);
