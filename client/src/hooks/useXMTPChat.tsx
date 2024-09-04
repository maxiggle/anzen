import { JsonRpcSigner, CloudflareProvider } from "ethers";
import { FormEvent, useState } from "react";
import usePersistentState from "./usePersistentState";
import { connect, isValidEthereumAddress, loadKeys, storeKeys } from "../utils";
import { Client } from "@xmtp/xmtp-js";
import config from "../utils/config";

export default function useXMTPChat() {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  const [conversationFound, setConversationFound] = useState(false);
  const [peerAddress, setPeerAddress] = useState<string | null>(null);
  const [loadingResolve, setLoadingResolve] = useState(false);
  const [canMessage, setCanMessage] = useState(false);
  const [createNew, setCreateNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  const [signerAddress, setSignerAddress] = usePersistentState<string | null>(
    "anzen:signer:address",
    null
  );
  const [networkOn, setNetworkOn] = usePersistentState<boolean>(
    "anzen:isnetwork:on",
    false
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

  const handleLogout = () => {};

  const initXmtpWithKeys = async function (): Promise<void> {
    if (!signer || !signerAddress) {
      return handleLogout();
    }

    // Fix the type gymnastics here
    let keys = loadKeys(signerAddress!) as Uint8Array;
    if (!keys) {
      keys = await Client.getKeys(signer, {
        env: config.xmtp.environment,
        skipContactPublishing: true,
        persistConversations: false,
      });
      storeKeys(signerAddress, keys as Buffer);
    }

    const xmtp = await Client.create(null, {
      env: config.xmtp.environment,
      privateKeyOverride: keys,
    });

    setNetworkOn(Boolean(xmtp.address));
    setClient(xmtp);
    // if (isConsent) {
    //   //Refresh consent
    //   await xmtp.contacts.refreshConsentList();
    // }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearchChange = async (e: FormEvent | any) => {
    setCreateNew(false);
    setConversationFound(false);
    setSearchTerm(e.target.value);
    console.log("handleSearchChange", e.target.value);
    setMessage("Searching...");
    const addressInput = e.target.value;
    const isEthDomain = /\.eth$/.test(addressInput);
    let resolvedAddress = addressInput;
    if (isEthDomain) {
      setLoadingResolve(true);
      try {
        const provider = new CloudflareProvider();
        resolvedAddress = await provider.resolveName(resolvedAddress);
      } catch (error) {
        console.log(error);
        // setMessage("Error resolving address");
        setCreateNew(false);
      } finally {
        setLoadingResolve(false);
      }
    }
    console.log("resolvedAddress", resolvedAddress);
    if (resolvedAddress && isValidEthereumAddress(resolvedAddress)) {
      processEthereumAddress(resolvedAddress);
      setSearchTerm(resolvedAddress); // <-- Add this line
    } else {
      setMessage("Invalid Ethereum address");
      setPeerAddress(null);
      setCreateNew(false);
      setCanMessage(false);
    }
  };

  const processEthereumAddress = async (address: string) => {
    setPeerAddress(address);
    if (address === client?.address) {
      setMessage("No self messaging allowed");
      setCreateNew(false);
      // setCanMessage(false);
    } else {
      const canMessageStatus = await client?.canMessage(address);
      if (canMessageStatus) {
        setPeerAddress(address);
        // setCanMessage(true);
        setMessage("Address is on the network ✅");
        setCreateNew(true);
      } else {
        //  setCanMessage(false);
        setMessage("Address is not on the network ❌");
        setCreateNew(false);
      }
    }
  };

  return {
    handleSearchChange,
    walletConnected,
    setWalletConnected,
    setSignerAddress,
    initXmtpWithKeys,
    startConnection,
    signerAddress,
    xmtp: client,
    loadingResolve,
    conversationFound,
    setSigner,
    createNew,
    networkOn,
    searchTerm,
    peerAddress,
    canMessage,
    message,
    signer,
  };
}
