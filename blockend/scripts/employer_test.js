const { ethers } = require('ethers');
require('dotenv').config();



const employerAbi = [ 
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
const contractAddress = "0xa676B5B3afB00C838B42e0aaBa56753a923aB9EF";
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

async function main() {
    await generateContract(employeeAddress, "Position: Software Engineer; Salary: $100,000; Start Date: 2024-09-01")
    // console.log("Generated ID: ", generatedId);
    // await getContractContent(2);
    // await getMessageHistory(1);
    
}

main().catch(console.error);
