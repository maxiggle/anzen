export default {
  web3AuthClientId: import.meta.env.VITE_APP_WEB3_AUTH_CLIENT_ID,
  galadrielPrivateKey: import.meta.env.VITE_APP_PRIVATE_KEY_GALADRIEL,
  employeePrivateKey: import.meta.env.VITE_APP_PRIVATE_KEY_EMPLOYEE,
  employerContractAddress: import.meta.env.VITE_APP_EMPLOYER_CONTRACT_ADDRESS,
  galadrielRpcUrl: import.meta.env.VITE_APP_GALADRIEL_RPC_URL,
  employeeAddress: import.meta.env.VITE_APP_EMPLOYEE_ADDRESS,
  employerAbi: [ 
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
  ]
  
}