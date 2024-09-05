import { createKintoSDK, KintoAccountInfo } from 'kinto-web-sdk';
import {
  encodeFunctionData, Address, getContract,
  defineChain, createPublicClient, http
} from 'viem';
import { getERC20Balances, TokenBalance } from './BlockscoutUtils';
import contractsJSON from './abis/7887.json';
import { KYCViewerService } from './KYCViewerService';

export const counterAbi = [{ "type": "constructor", "inputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "count", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "increment", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }];

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