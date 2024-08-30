

const { ethers } = require('ethers');
require('dotenv').config();

const employeeAbi = [
    {
        "inputs": [
          {
            "internalType": "address",
            "name": "initialOracleAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_employerContractAddress",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "employerContractId",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "reviewId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "isApproved",
            "type": "bool"
          }
        ],
        "name": "ContractReviewed",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOracleAddress",
            "type": "address"
          }
        ],
        "name": "OracleAddressUpdated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "reviewId",
            "type": "uint256"
          }
        ],
        "name": "ReviewContractCalled",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "reviewId",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "approval",
            "type": "bool"
          }
        ],
        "name": "approveContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "contractReviews",
        "outputs": [
          {
            "internalType": "address",
            "name": "employee",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "employerContractId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "review",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isApproved",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "messagesCount",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "employerContractAddress",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "reviewId",
            "type": "uint256"
          }
        ],
        "name": "getMessageHistory",
        "outputs": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "role",
                "type": "string"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "contentType",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "value",
                    "type": "string"
                  }
                ],
                "internalType": "struct IOracle.Content[]",
                "name": "content",
                "type": "tuple[]"
              }
            ],
            "internalType": "struct IOracle.Message[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "reviewId",
            "type": "uint256"
          }
        ],
        "name": "getReviewContent",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "runId",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "string",
                "name": "id",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "content",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "functionName",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "functionArguments",
                "type": "string"
              },
              {
                "internalType": "uint64",
                "name": "created",
                "type": "uint64"
              },
              {
                "internalType": "string",
                "name": "model",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "systemFingerprint",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "object",
                "type": "string"
              },
              {
                "internalType": "uint32",
                "name": "completionTokens",
                "type": "uint32"
              },
              {
                "internalType": "uint32",
                "name": "promptTokens",
                "type": "uint32"
              },
              {
                "internalType": "uint32",
                "name": "totalTokens",
                "type": "uint32"
              }
            ],
            "internalType": "struct IOracle.OpenAiResponse",
            "name": "response",
            "type": "tuple"
          },
          {
            "internalType": "string",
            "name": "errorMessage",
            "type": "string"
          }
        ],
        "name": "onOracleOpenAiLlmResponse",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "oracleAddress",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "employerContractId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "query",
            "type": "string"
          }
        ],
        "name": "reviewContract",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOracleAddress",
            "type": "address"
          }
        ],
        "name": "setOracleAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
];

const PRIVATE_KEY = process.env.PRIVATE_KEY_GALADRIEL;
const contractAddress = "0x26DFCBc3B14bA3559f51e77CAb05BB7e69097B3A";
const RPC_URL = "https://devnet.galadriel.com/"
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider); 
const employeeAddress = "0xb8FCeb74C6c7e9DEaAcE41060747670d43475997";

const employeeContract = new ethers.Contract(contractAddress, employeeAbi, wallet);

async function reviewContract(employerContractId, query) {
    // Call the contract function and wait for the transaction to be mined
    const tx = await employeeContract.reviewContract(employerContractId, query);

    // Wait for the transaction to be confirmed
    const receipt = await tx.wait();

    const events = receipt.logs.map((log) => {
        try {
            return employeeContract.interface.parseLog(log);
        } catch (e) {
            return null; 
        }
    }).filter(e => e !== null);
    // Assuming the function returns a uint256 (reviewId), capture it directly
    console.log(events);
   const  reviewId = events[0].args[0];
   console.log('contract reviewed', reviewId);
    return reviewId;
}
async function getReviewContent(reviewId) {
    const content = await employeeContract.getReviewContent(reviewId);
    console.log(content);
    return content;
    
}
async function main() {
//   const id =  await reviewContract(2, "review this contract and explain all the terms in details");
  const content = await getReviewContent(1);
  console.log("reviewed content:", content)
}

main().catch(console.error);
