require('dotenv').config();

const { ethers } = require('ethers');

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY_GALADRIEL;
const RPC_URL = "https://devnet.galadriel.com/"

// Initialize provider and signer
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract ABI and address
const contractABI =  [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "initialOracleAddress",
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
        "internalType": "address",
        "name": "hr",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "employee",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "contractId",
        "type": "uint256"
      }
    ],
    "name": "ContractGenerated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "contractId",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contractId",
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
    "name": "contractRuns",
    "outputs": [
      {
        "internalType": "address",
        "name": "employee",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "hr",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "contractContent",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "employeeReview",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "employee",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "employeeTerms",
        "type": "string"
      }
    ],
    "name": "generateContract",
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
        "internalType": "uint256",
        "name": "contractId",
        "type": "uint256"
      }
    ],
    "name": "getContractContent",
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
        "name": "contractId",
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
        "name": "contractId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "query",
        "type": "string"
      }
    ],
    "name": "reviewContract",
    "outputs": [],
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
]
const contractAddress = "0x3112D264DEE05031A89663135107119103282e1e"; 

// Initialize contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function generateContract(employeeAddress, employeeTerms) {
    const tx = await contract.generateContract(employeeAddress, employeeTerms);
    await tx.wait();
    console.log(`Contract generated with ID: ${tx.value.toString()}`);
}

async function reviewContract(contractId, query) {
    const tx = await contract.reviewContract(contractId, query);
    await tx.wait();
    console.log(`Contract with ID ${contractId} reviewed.`);
}

async function approveContract(contractId, approval) {
    const tx = await contract.approveContract(contractId, approval);
    await tx.wait();
    console.log(`Contract with ID ${contractId} approval status: ${approval}`);
}

async function getContractContent(contractId) {
    const content = await contract.getContractContent(contractId);
    console.log(`Contract Content for ID ${contractId}: ${content}`);
}

async function getMessageHistory(contractId) {
    const messages = await contract.getMessageHistory(contractId);
    console.log(`Message History for Contract ID ${contractId}:`);
    messages.forEach((message, index) => {
        console.log(`Message ${index + 1}: Role - ${message.role}, Content - ${message.content[0].value}`);
    });
}

async function main() {
    // Example interaction
    const employeeAddress = "0xb8FCeb74C6c7e9DEaAcE41060747670d43475997";
    const employeeTerms = "Standard employment including health insurance, 401k, and more and employer name should be Gef and name of company should be Variance";
    
    // await generateContract(employeeAddress, employeeTerms);
    // await reviewContract(1, "Please review the benefits section.");
    // await approveContract(1, true);
    await getContractContent(1);
    // await getMessageHistory(1);
}

main().catch(console.error);
