import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import config from "./config";


export default () => {
  return new Web3Auth({
    clientId: config.web3AuthClientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider: new EthereumPrivateKeyProvider({
      config: {
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0xaa36a7",
          rpcTarget: "https://rpc.ankr.com/eth_sepolia",
          // Avoid using public rpcTarget in production.
          // Use services like Infura, Quicknode etc
          displayName: "Ethereum Sepolia Testnet",
          blockExplorerUrl: "https://sepolia.etherscan.io",
          ticker: "ETH",
          tickerName: "Ethereum",
          logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        }
      },
    }),
  });
}
