const { ethers } = require('ethers');
require('dotenv').config();

const schemaAbi = [{
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "fieldType",
            "type": "string"
          }
        ],
        "indexed": false,
        "internalType": "struct ContractSchema.SchemaField[]",
        "name": "fields",
        "type": "tuple[]"
      }
    ],
    "name": "SchemaCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "fieldType",
            "type": "string"
          }
        ],
        "internalType": "struct ContractSchema.SchemaField[]",
        "name": "data",
        "type": "tuple[]"
      }
    ],
    "name": "createSchema",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }]

  const employeeAbi = 
[
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
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contractId",
        "type": "uint256"
      }
    ],
    "name": "viewGeneratedContract",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const PRIVATE_KEY = process.env.PRIVATE_KEY_GALADRIEL;
const schemaContractAddress = "0xe01e21c1201b5DB703a08eb494928baa92474a34";
const employeeContractAddress = "0x5932977b82b4782940D5c60ff34321c26d575a8a"
const RPC_URL = "https://devnet.galadriel.com/"
const providerForSchema = new ethers.JsonRpcProvider(RPC_URL);
const providerForEmployee = new ethers.JsonRpcProvider(RPC_URL);
const wallet1 = new ethers.Wallet(PRIVATE_KEY, providerForSchema);
const wallet2 = new ethers.Wallet(PRIVATE_KEY, providerForEmployee);

const schema = new ethers.Contract(schemaContractAddress, schemaAbi, wallet1);
const employee = new ethers.Contract(employeeContractAddress, employeeAbi, wallet2);
 

const prepareAndSendSchema = async (aiGeneratedText) => {
    const schemaFields = generateSchemaFromText(aiGeneratedText);
    console.log("Schema fields:", aiGeneratedText);
    // Assume `client` is your blockchain client instance
    try {
        const tx = await schema.createSchema({
            name: "Employment Contract",
            data: schemaFields
        });

        console.log("Transaction hash:", tx);
        await tx.wait();
        console.log("Schema created successfully.");
    } catch (error) {
        console.error("Error creating schema:", error);
    }
};

 async function getGeneratedContract(contractId) {
    try {
        const contract = await employee.viewGeneratedContract(contractId);
        if (!contract) {
            console.error("Generated contract not found.");
            return null;
        }
        return contract;
    } catch (error) {
        console.error("Error fetching generated contract:", error);
        return null;
    }
    
}

  async function main() {
   const aiGeneratedText = await getGeneratedContract(1);
   await prepareAndSendSchema(aiGeneratedText);


  }
  main().catch(console.error);

  const generateSchemaFromText = (text) => {
    // Example extraction logic (adjust based on your text structure)
    const extractedData = {
        employeeLastName: extractLastName(text),
        employeeFirstName: extractFirstName(text),
        jobTitle: extractJobTitle(text),
        startDate: extractStartDate(text),
        salary: extractSalary(text),
        weeklyHours: extractWeeklyHours(text),
        employeeAddress: extractEmployeeAddress(text),
        hrAddress: extractHrAddress(text),
        contractDetails: extractContractDetails(text),
        status: "Pending",
        employeeSigned: false,
        hrSigned: false,
        employeeSignature: "0x",
        hrSignature: "0x",
        finalizedAt: 0
    };

    return [
        { name: "employeeLastName", type: "string" },
        { name: "employeeFirstName", type: "string" },
        { name: "jobTitle", type: "string" },
        { name: "startDate", type: "uint256" },
        { name: "salary", type: "uint256" },
        { name: "weeklyHours", type: "uint256" },
        { name: "employeeAddress", type: "address" },
        { name: "hrAddress", type: "address" },
        { name: "contractDetails", type: "string" },
        { name: "status", type: "string" },
        { name: "employeeSigned", type: "bool" },
        { name: "hrSigned", type: "bool" },
        { name: "employeeSignature", type: "bytes" },
        { name: "hrSignature", type: "bytes" },
        { name: "finalizedAt", type: "uint256" }
    ];
};

// Function to convert extracted data into the format for `createSchema`
const prepareSchemaData = (text) => {
    const schemaFields = generateSchemaFromText(text);
    // Assuming `client` is your blockchain client instance
    client.createSchema({
        name: "Employment Contract",
        data: schemaFields
    });
};
