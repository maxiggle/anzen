import {
  Wallet,
  JsonRpcProvider,
  BrowserProvider,
  JsonRpcSigner,
} from "ethers";
import config from "../utils/config";
import { useState } from "react";
import usePersistentState from "./usePersistentState";

const getEthereumInstance = () => {
  return typeof window !== "undefined" && window.ethereum;
};

const connect = {
  async viaJsonRPC() {
    const provider = new JsonRpcProvider(config.xmtp.kintoRPCURL);
    const wallet = new Wallet(config.xmtp.kintoPrivateKey, provider);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    return {
      address,
      signer,
      wallet,
    };
  },

  async viaBrowser() {
    const eth = getEthereumInstance();
    if (!eth) return;

    await window.ethereum!.request({
      method: "eth_requestAccounts",
    });

    const provider = new BrowserProvider(window.ethereum!);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    return {
      address,
      signer,
    };
  },
};
export default function useXMTPChat() {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [signerAddress, setSignerAddress] = usePersistentState<string | null>(
    "anzen:signer:address",
    null
  );
  const [walletConnected, setWalletConnected] = usePersistentState<boolean>(
    "anzen:wallet:connected",
    false
  );

  const startConnection = async () => {
    try {
      const { signer, address } = await connect.viaJsonRPC();
      setWalletConnected(true);
      setSignerAddress(address);
      setSigner(signer);
    } catch (error) {
      alert("Connection failed");
      console.error(error);
      throw error;
    }
  };

  return {
    walletConnected,
    setWalletConnected,
    setSignerAddress,
    signerAddress,
    startConnection,
    setSigner,
    signer,
  };
}
