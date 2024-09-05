import Web3 from "web3";
import { setTimeout } from "timers/promises";

// Configuration
const RPC_URL = "https://rpc.kinto-rpc.com/"; // Replace with your RPC URL
const PRIVATE_KEY =
  "0xef060cb7d3f8ec2db57965356a38775806ed527dafe85a1ecee920f1673d4b0d"; // Replace with the owner account's private key
const CONTRACT_ADDRESS = "0x42d6504821D7bF05f0aCA0fbc6EAC85746e686E3"; // Replace with your contract address

// Contract ABI (make sure it matches your deployed contract)
const CONTRACT_ABI = [
  {
    inputs: [],
    name: "performUpkeep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "checkUpkeep",
    outputs: [
      { internalType: "bool", name: "upkeepNeeded", type: "bool" },
      { internalType: "bytes", name: "", type: "bytes" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Web3 initialization
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

// Account loading
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

// Contract loading
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

async function checkAndPerformUpkeep() {
  try {
    // Check if upkeep is needed
    const [upkeepNeeded] = await contract.methods.checkUpkeep("0x").call();

    if (upkeepNeeded) {
      // Transaction preparation
      const gasPrice = await web3.eth.getGasPrice();
      const gasEstimate = await contract.methods
        .performUpkeep("0x")
        .estimateGas({ from: account.address });

      const tx = {
        from: account.address,
        to: CONTRACT_ADDRESS,
        gas: gasEstimate,
        gasPrice: gasPrice,
        data: contract.methods.performUpkeep("0x").encodeABI(),
      };

      // Transaction sending
      const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      console.log(`Transaction executed: ${receipt.transactionHash}`);
    } else {
      console.log("No upkeep needed at the moment");
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}

async function main() {
  while (true) {
    console.log("Checking for upkeep...");
    await checkAndPerformUpkeep();
    // Wait for a month (in milliseconds)
    await setTimeout(30 * 24 * 60 * 60 * 1000);
  }
}

main().catch(console.error);
