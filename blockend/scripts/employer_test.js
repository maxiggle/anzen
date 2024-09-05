const { ethers } = require('ethers');
require('dotenv').config();



const employerAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "initialOracleAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_textStorageAddress",
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
        "internalType": "enum ContractStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "name": "ContractStatusUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Log",
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
        "name": "attestjsonId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "extractedText",
        "type": "string"
      }
    ],
    "name": "TextExtracted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "employerContractStructs",
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
        "internalType": "bool",
        "name": "isApproved",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "messagesCount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isTextExtraction",
        "type": "bool"
      },
      {
        "internalType": "enum ContractStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contractid",
        "type": "uint256"
      }
    ],
    "name": "extractTextFromGeneratedContract",
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
    "inputs": [],
    "name": "getAllContracts",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "components": [
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
            "internalType": "bool",
            "name": "isApproved",
            "type": "bool"
          },
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
            "name": "messages",
            "type": "tuple[]"
          },
          {
            "internalType": "uint256",
            "name": "messagesCount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isTextExtraction",
            "type": "bool"
          },
          {
            "internalType": "enum ContractStatus",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct EmployerContract.EmployerContractStruct[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "internalType": "bool[]",
        "name": "",
        "type": "bool[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
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
    "name": "getContractStatus",
    "outputs": [
      {
        "internalType": "enum ContractStatus",
        "name": "",
        "type": "uint8"
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
    "name": "getExtractedText",
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
        "internalType": "address",
        "name": "newOracleAddress",
        "type": "address"
      }
    ],
    "name": "setOracleAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "textStorageAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const PRIVATE_KEY = process.env.PRIVATE_KEY_GALADRIEL;
const contractAddress = "0x4A736124E80eDa4B0DfCCC62E607b34D25a245C9";
const RPC_URL = "https://devnet.galadriel.com/"
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider); 
const employeeAddress = "0xb8FCeb74C6c7e9DEaAcE41060747670d43475997";

const employerContract = new ethers.Contract(contractAddress, employerAbi, wallet);

let generatedId = 0;
async function generateContract(employeeAddress, employeeTerms) {
    const tx = await employerContract.generateContract(employeeAddress, employeeTerms);
    const receipt = await tx.wait();

    const events = receipt.logs.map((log) => {
        try {
            return employerContract.interface.parseLog(log);
        } catch (e) {
            return null; 
        }
    }).filter(e => e !== null);
    
    // Get the ContractGenerated event
  console.log("ContractGenerated event: ", events);
  generatedId = events[0].args.contractId;
  console.log("Contract ID: ", generatedId);
}



async function getContractContent(contractId) {
    const content = await employerContract.getContractContent(contractId);
    console.log(`Contract Content for ID ${contractId}: ${content}`);
}

async function getMessageHistory(contractId) {
    const messages = await employerContract.getMessageHistory(contractId);
    console.log(`Message History for Contract ID ${contractId}:`);
    messages.forEach((message, index) => {
        console.log(`Message ${index + 1}: Role - ${message.role}, Content - ${message.content[0].value}`);
    });
}

async function getAllContracts() {
  const contracts = await employerContract.getAllContracts();
  console.log("All Contracts: ", contracts);
}

async function extractTextFromGeneratedContract(contractId) {
  const content = await employerContract.extractTextFromGeneratedContract(contractId);
  console.log(`Contract Content for ID ${contractId}: ${content}`);
}

async function getExtractedText(contractId) {
  const content = await employerContract.getExtractedText(contractId);
  console.log(`Contract Content for ID ${contractId}: ${content}`);
  
}

async function getContractStatus(contractId) {
  const status = await employerContract.getContractStatus(contractId);
  console.log(`Contract Status for ID ${contractId}: ${status}`);
  
}

async function main() {
  // await extractTextFromGeneratedContract(1);
  // await getExtractedText(1);
  await generateContract(employeeAddress, "Position: Software Engineer; Salary: $100,000; Start Date: 2024-09-01")
  // await getContractStatus(2);
  // await getAllContracts();
    // await generateContract(employeeAddress, "Position: Software Engineer; Salary: $100,000; Start Date: 2024-09-01") 
    // console.log("Generated ID: ", generatedId);
    // await getContractContent(1);
    // await getMessageHistory(1);
    
}

main().catch(console.error);
