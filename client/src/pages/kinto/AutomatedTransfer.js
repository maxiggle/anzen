const Web3 = require("web3");
const { setTimeout } = require("timers/promises");

// Configuration
const RPC_URL = "https://mainnet.infura.io/v3/YOUR-PROJECT-ID"; // Remplacez par votre URL RPC
const PRIVATE_KEY = "YOUR_PRIVATE_KEY"; // Remplacez par la clé privée du compte propriétaire
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"; // Remplacez par l'adresse de votre contrat

// ABI du contrat (assurez-vous qu'il correspond à votre contrat déployé)
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

// Initialisation de Web3
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

// Chargement du compte
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

// Chargement du contrat
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

async function checkAndPerformUpkeep() {
  try {
    // Vérification si l'upkeep est nécessaire
    const [upkeepNeeded] = await contract.methods.checkUpkeep("0x").call();

    if (upkeepNeeded) {
      // Préparation de la transaction
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

      // Envoi de la transaction
      const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      console.log(`Transaction effectuée : ${receipt.transactionHash}`);
    } else {
      console.log("Pas besoin d'upkeep pour le moment");
    }
  } catch (error) {
    console.error(`Une erreur s'est produite : ${error.message}`);
  }
}

async function main() {
  while (true) {
    console.log("Vérification de l'upkeep...");
    await checkAndPerformUpkeep();
    // Attente d'un mois (en millisecondes)
    await setTimeout(30 * 24 * 60 * 60 * 1000);
  }
}

main().catch(console.error);
