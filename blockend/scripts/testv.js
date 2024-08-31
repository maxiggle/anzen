require("dotenv").config();

const { ethers } = require("ethers");

// Load environment variables
const PRIVATE_KEY =
  "846b0dde34ff50df842f5ff639bb61b05406b9f45d8fdb816b5acda3b2618174";
const RPC_URL = "https://rpc.kinto-rpc.com";

// Initialize provider and signer
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

console.log({ signer });
