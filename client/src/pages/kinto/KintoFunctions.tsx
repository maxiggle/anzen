import { createKintoSDK, KintoAccountInfo } from 'kinto-web-sdk';
import {
  encodeFunctionData, Address, getContract,
  defineChain, createPublicClient, http, parseAbi
} from 'viem';
import { getERC20Balances, TokenBalance } from './BlockscoutUtils';
import contractsJSON from './abis/7887.json';
import { KYCViewerService } from './KYCViewerService';

export const counterAbi = [{ "type": "constructor", "inputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "count", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "increment", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }];
//test
export const kinto = defineChain({
  id: 7887,
  name: 'Kinto',
  network: 'kinto',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.kinto-rpc.com/'],
      webSocket: ['wss://rpc.kinto.xyz/ws'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://kintoscan.io' },
  },
});

export const kintoSDK = createKintoSDK('0xCFE10657E75385F0c93Ee7e0Aec266Ae9382E0ED');
export const counterAddress = "0xCFE10657E75385F0c93Ee7e0Aec266Ae9382E0ED" as Address;
export const paymentAddress = "0xCfe808D7994bB4b3741008B4c301688D4Cd4958C" as Address;

export async function kintoLogin() {
  try {
    await kintoSDK.createNewWallet();
  } catch (error) {
    console.error('Failed to login/signup:', error);
  }
}

export async function transferFunds(recipient: string, amount: bigint) {
  const fundTransferAbi = [
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];

  const data = encodeFunctionData({
    abi: fundTransferAbi,
    functionName: 'transferFunds',
    args: [recipient, amount]
  });
  
  try {
    const response = await kintoSDK.sendTransaction([{ to: paymentAddress, data, value: amount }]);
    console.log('Transfer successful:', response);
    return response;
  } catch (error) {
    console.error('Failed to transfer funds:', error);
    throw error;
  }
}

export async function fetchCounter() {
  const client = createPublicClient({
    chain: kinto,
    transport: http(),
  });
  const counterContract = getContract({
    address: counterAddress as Address,
    abi: counterAbi,
    client: { public: client }
  });
  const count = await counterContract.read.count([]) as BigInt;
  return Number(count.toString());
}

export async function increaseCounter() {
  const data = encodeFunctionData({
    abi: counterAbi,
    functionName: 'increment',
    args: []
  });
  try {
    await kintoSDK.sendTransaction([{ to: counterAddress, data, value: BigInt(0) }]);
    return await fetchCounter();
  } catch (error) {
    console.error('Failed to increase counter:', error);
    throw error;
  }
}

export async function fetchKYCViewerInfo(walletAddress: Address) {
  const client = createPublicClient({
    chain: kinto,
    transport: http(),
  });
  const kycViewer = getContract({
    address: contractsJSON.contracts.KYCViewer.address as Address,
    abi: contractsJSON.contracts.KYCViewer.abi,
    client: { public: client }
  });

  try {
    const [isIndividual, isCorporate, isKYC, isSanctionsSafe, getCountry, getWalletOwners] = await Promise.all([
      kycViewer.read.isIndividual([walletAddress]),
      kycViewer.read.isCompany([walletAddress]),
      kycViewer.read.isKYC([walletAddress]),
      kycViewer.read.isSanctionsSafe([walletAddress]),
      kycViewer.read.getCountry([walletAddress]),
      kycViewer.read.getWalletOwners([walletAddress])
    ]);

    return {
      isIndividual,
      isCorporate,
      isKYC,
      isSanctionsSafe,
      getCountry,
      getWalletOwners
    };
  } catch (error) {
    console.error('Failed to fetch KYC viewer info:', error);
    throw error;
  }
}

export async function fetchAccountInfo(): Promise<KintoAccountInfo> {
  try {
    return await kintoSDK.connect();
  } catch (error) {
    console.error('Failed to fetch account info:', error);
    throw error;
  }
}

export async function fetchTokenBalances(walletAddress: Address): Promise<TokenBalance[]> {
  return await getERC20Balances(walletAddress);
}

export async function transferToken(
  tokenAddress: Address,
  recipientAddress: Address,
  amount: bigint
) {
  const data = encodeFunctionData({
    abi: [{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}],
    functionName: 'transfer',
    args: [recipientAddress, amount]
  });

  try {
    const response = await kintoSDK.sendTransaction([{ 
      to: tokenAddress, 
      data, 
      value: BigInt(0) 
    }]);
    console.log('Transfer response:', response);
    return response;
  } catch (error) {
    console.error('Failed to transfer token:', error);
    throw error;
  }
}

export async function fetchDestinationKYC(recipientAddress: Address) {
  const kycViewer = KYCViewerService.getInstance();
  return await kycViewer.fetchKYCInfo(recipientAddress);
}

const monthlyTransferAbi = parseAbi([
  'function initializeAndApprove(address _recipient, uint256 _amount, address _tokenAddress, uint256 _maxAllowance)',
  'function performUpkeep(bytes calldata) external',
  'function checkUpkeep(bytes calldata) external view returns (bool upkeepNeeded, bytes memory)',
  'function rechargeAllowance()',
  'function updateRecipient(address _newRecipient)',
  'function updateAmount(uint256 _newAmount)',
  'function updateMaxAllowance(uint256 _newMaxAllowance)',
  'function lastTransferTimestamp() view returns (uint256)',
  'function interval() view returns (uint256)',
  'function currentAllowance() view returns (uint256)'
]);

export const monthlyTransferAddress = "0x1a0e143c4212003f425202847ed6DA0E03C70b43" as Address;

export async function initializeAndApproveMonthlyTransfer(
  recipient: Address,
  amount: bigint,
  tokenAddress: Address,
  maxAllowance: bigint
) {
  const data = encodeFunctionData({
    abi: monthlyTransferAbi,
    functionName: 'initializeAndApprove',
    args: [recipient, amount, tokenAddress, maxAllowance]
  });

  try {
    const response = await kintoSDK.sendTransaction([{ to: monthlyTransferAddress, data, value: BigInt(0) }]);
    console.log('Initialisation et approbation réussies:', response);
    return response;
  } catch (error) {
    console.error('Échec de l\'initialisation et de l\'approbation:', error);
    throw error;
  }
}

export async function checkMonthlyTransferUpkeep() {
  const client = createPublicClient({
    chain: kinto,
    transport: http(),
  });
  const monthlyTransferContract = getContract({
    address: monthlyTransferAddress,
    abi: monthlyTransferAbi,
    client: { public: client }
  });
  
  try {
    const [upkeepNeeded, ] = await monthlyTransferContract.read.checkUpkeep(['0x']);
    return upkeepNeeded;
  } catch (error) {
    console.error('Échec de la vérification de l\'upkeep:', error);
    throw error;
  }
}

export async function performMonthlyTransfer() {
  const data = encodeFunctionData({
    abi: monthlyTransferAbi,
    functionName: 'performUpkeep',
    args: ['0x']
  });
  
  try {
    const response = await kintoSDK.sendTransaction([{ to: monthlyTransferAddress, data, value: BigInt(0) }]);
    console.log('Transfert mensuel effectué:', response);
    return response;
  } catch (error) {
    console.error('Échec du transfert mensuel:', error);
    throw error;
  }
}

export async function rechargeAllowance() {
  const data = encodeFunctionData({
    abi: monthlyTransferAbi,
    functionName: 'rechargeAllowance',
  });
  
  try {
    const response = await kintoSDK.sendTransaction([{ to: monthlyTransferAddress, data, value: BigInt(0) }]);
    console.log('Rechargement de l\'allocation réussi:', response);
    return response;
  } catch (error) {
    console.error('Échec du rechargement de l\'allocation:', error);
    throw error;
  }
}

export async function updateRecipient(newRecipient: Address) {
  const data = encodeFunctionData({
    abi: monthlyTransferAbi,
    functionName: 'updateRecipient',
    args: [newRecipient]
  });
  
  try {
    const response = await kintoSDK.sendTransaction([{ to: monthlyTransferAddress, data, value: BigInt(0) }]);
    console.log('Mise à jour du destinataire réussie:', response);
    return response;
  } catch (error) {
    console.error('Échec de la mise à jour du destinataire:', error);
    throw error;
  }
}

export async function updateAmount(newAmount: bigint) {
  const data = encodeFunctionData({
    abi: monthlyTransferAbi,
    functionName: 'updateAmount',
    args: [newAmount]
  });
  
  try {
    const response = await kintoSDK.sendTransaction([{ to: monthlyTransferAddress, data, value: BigInt(0) }]);
    console.log('Mise à jour du montant réussie:', response);
    return response;
  } catch (error) {
    console.error('Échec de la mise à jour du montant:', error);
    throw error;
  }
}

export async function updateMaxAllowance(newMaxAllowance: bigint) {
  const data = encodeFunctionData({
    abi: monthlyTransferAbi,
    functionName: 'updateMaxAllowance',
    args: [newMaxAllowance]
  });
  
  try {
    const response = await kintoSDK.sendTransaction([{ to: monthlyTransferAddress, data, value: BigInt(0) }]);
    console.log('Mise à jour de l\'allocation maximale réussie:', response);
    return response;
  } catch (error) {
    console.error('Échec de la mise à jour de l\'allocation maximale:', error);
    throw error;
  }
}

export async function getTransferInfo() {
  const client = createPublicClient({
    chain: kinto,
    transport: http(),
  });
  const monthlyTransferContract = getContract({
    address: monthlyTransferAddress,
    abi: monthlyTransferAbi,
    client: { public: client }
  });
  
  try {
    const [lastTransferTimestamp, interval, currentAllowance] = await Promise.all([
      monthlyTransferContract.read.lastTransferTimestamp(),
      monthlyTransferContract.read.interval(),
      monthlyTransferContract.read.currentAllowance()
    ]);
    
    return { lastTransferTimestamp, interval, currentAllowance };
  } catch (error) {
    console.error('Échec de la récupération des informations de transfert:', error);
    throw error;
  }
}

export async function executeMonthlyTransferIfNeeded() {
  const upkeepNeeded = await checkMonthlyTransferUpkeep();
  if (upkeepNeeded || !upkeepNeeded ) {
    await performMonthlyTransfer();
  } else {
    console.log('Aucun transfert nécessaire pour le moment.');
  }
}

// Fonction principale pour configurer et exécuter les transferts mensuels
export async function setupAndRunMonthlyTransfer(
  recipient: Address,
  amount: bigint,
  tokenAddress: Address,
  maxAllowance: bigint
) {
  try {
    await initializeAndApproveMonthlyTransfer(recipient, amount, tokenAddress, maxAllowance);
    
    await executeMonthlyTransferIfNeeded();
    
    console.log('Configuration et premier transfert (si nécessaire) effectués avec succès.');
  } catch (error) {
    console.error('Erreur lors de la configuration ou de l\'exécution du transfert mensuel:', error);
  }
}

const budgetAllocationAbi = parseAbi([
    'function initialize(address _tokenAddress)',
    'function allocateBudget(uint256 _amount)',
    'function authorizeUser(address _user)',
    'function unauthorizeUser(address _user)',
    'function withdrawFunds(uint256 _amount)',
    'function getContractBalance() view returns (uint256)',
    'function getUserAllocation(address _user) view returns (uint256)'
  ]);
  
  export const budgetAllocationAddress = "0x62aF348637BC4dcBb6A1eA843CB888FC7da9C80C" as Address;
  
  export async function initializeBudgetAllocation(tokenAddress: Address) {
    const data = encodeFunctionData({
      abi: budgetAllocationAbi,
      functionName: 'initialize',
      args: [tokenAddress]
    });
  
    try {
      const response = await kintoSDK.sendTransaction([{ to: budgetAllocationAddress, data, value: BigInt(0) }]);
      console.log('Initialisation réussie:', response);
      return response;
    } catch (error) {
      console.error('Échec de l\'initialisation:', error);
      throw error;
    }
  }
  
  export async function allocateBudget(amount: bigint) {
    const data = encodeFunctionData({
      abi: budgetAllocationAbi,
      functionName: 'allocateBudget',
      args: [amount]
    });
  
    try {
      const response = await kintoSDK.sendTransaction([{ to: budgetAllocationAddress, data, value: BigInt(0) }]);
      console.log('Allocation du budget réussie:', response);
      return response;
    } catch (error) {
      console.error('Échec de l\'allocation du budget:', error);
      throw error;
    }
  }
  
  export async function authorizeUser(user: Address) {
    const data = encodeFunctionData({
      abi: budgetAllocationAbi,
      functionName: 'authorizeUser',
      args: [user]
    });
  
    try {
      const response = await kintoSDK.sendTransaction([{ to: budgetAllocationAddress, data, value: BigInt(0) }]);
      console.log('Autorisation de l\'utilisateur réussie:', response);
      return response;
    } catch (error) {
      console.error('Échec de l\'autorisation de l\'utilisateur:', error);
      throw error;
    }
  }
  
  export async function unauthorizeUser(user: Address) {
    const data = encodeFunctionData({
      abi: budgetAllocationAbi,
      functionName: 'unauthorizeUser',
      args: [user]
    });
  
    try {
      const response = await kintoSDK.sendTransaction([{ to: budgetAllocationAddress, data, value: BigInt(0) }]);
      console.log('Révocation de l\'autorisation de l\'utilisateur réussie:', response);
      return response;
    } catch (error) {
      console.error('Échec de la révocation de l\'autorisation de l\'utilisateur:', error);
      throw error;
    }
  }
  
  export async function withdrawFunds(amount: bigint) {
    const data = encodeFunctionData({
      abi: budgetAllocationAbi,
      functionName: 'withdrawFunds',
      args: [amount]
    });
  
    try {
      const response = await kintoSDK.sendTransaction([{ to: budgetAllocationAddress, data, value: BigInt(0) }]);
      console.log('Retrait des fonds réussi:', response);
      return response;
    } catch (error) {
      console.error('Échec du retrait des fonds:', error);
      throw error;
    }
  }
  
  export async function getContractBalance() {
    const client = createPublicClient({
      chain: kinto,
      transport: http(),
    });
    const budgetAllocationContract = getContract({
      address: budgetAllocationAddress,
      abi: budgetAllocationAbi,
      client: { public: client }
    });
    
    try {
      const balance = await budgetAllocationContract.read.getContractBalance();
      return balance;
    } catch (error) {
      console.error('Échec de la récupération du solde du contrat:', error);
      throw error;
    }
  }
  
  export async function getUserAllocation(user: Address) {
    const client = createPublicClient({
      chain: kinto,
      transport: http(),
    });
    const budgetAllocationContract = getContract({
      address: budgetAllocationAddress,
      abi: budgetAllocationAbi,
      client: { public: client }
    });
    
    try {
      const allocation = await budgetAllocationContract.read.getUserAllocation([user]);
      return allocation;
    } catch (error) {
      console.error('Échec de la récupération de l\'allocation de l\'utilisateur:', error);
      throw error;
    }
  }