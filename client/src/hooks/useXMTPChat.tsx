import { JsonRpcSigner, CloudflareProvider } from "ethers";
import { FormEvent, useState } from "react";
import usePersistentState from "./usePersistentState";
import { connect, isValidEthereumAddress, loadKeys, storeKeys } from "../utils";
import { Client } from "@xmtp/xmtp-js";
import config from "../utils/config";

import { Buffer } from "buffer";

window.Buffer = Buffer;

/**
 * 
 * 
  const {
    client: xmtp,
    initialize,
    isLoading,
  } = useClient((err) => {
    console.log(err);
  });

  // const { startConnection, initXmtpWithKeys, walletConnected } = useXMTPChat();
  const messages = [
    {
      isUser: true,
      message: "Hello! How can I help you today?",
      time: "10:00 AM",
      status: "Sent",
    },
    {
      isUser: false,
      message: "Hi there! I have a question about my account.",
      time: "10:02 AM",
      status: "Received",
    },
    {
      isUser: true,
      message:
        "Of course! I'd be happy to assist you with your account. What specific question do you have?",
      time: "10:05 AM",
      status: "Sent",
    },
    {
      isUser: false,
      message:
        "I'm trying to update my billing information, but I'm having trouble finding where to do that.",
      time: "10:08 AM",
      status: "Received",
    },
    {
      isUser: true,
      message:
        "No problem! I can guide you through that process. First, go to your account settings by clicking on your profile picture in the top right corner.",
      time: "10:10 AM",
      status: "Sent",
    },
  ];

  const [signer, setSigner] = useState(null);
  const [client, setClient] = useState<Client | null>(null);
  const [walletConnected, setWalletConnected] = useState(false); // Add state for wallet connection

  const [signerAddress, setSignerAddress] = usePersistentState<string | null>(
    "anzen:signer:address",
    null
  );
  const getAddress = async (signer: any) => {
    try {
      return await signer?.getAddress();
    } catch (e) {
      console.log(e);
    }
  };
  const xconnectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setSigner(signer);
        setWalletConnected(true);
        let address = await getAddress(signer);
        localStorage.setItem("walletConnected", JSON.stringify(true)); // Save connection status in local storage
        localStorage.setItem("signerAddress", JSON.stringify(address)); // Save signer address in local storage
      } catch (error) {
        console.error("User rejected request", error);
      }
    } else {
      console.error("Metamask not found");
    }
  };

  useEffect(() => {
    if (!signer) return;
    (async () => {
      let xmtp = await Client.create(signer, { env: "dev" });
      const keys = await Client.getKeys(signer, {
        env: "dev",
        skipContactPublishing: true,
        persistConversations: false,
      });

      xmtp = await Client.create(null, {
        env: "dev",
        privateKeyOverride: keys,
      });

      console.log(xmtp, isLoading, keys);
      // initialize({
      //   keys: await Client.getKeys(signer, {
      //     env: config.xmtp.environment,
      //     skipContactPublishing: true,
      //     persistConversations: false,
      //   }),
      // });
    })();
  }, [xmtp, signer]);

  const initXmtpWithKeys = async function (): Promise<void> {
    console.log("Entered");

    if (!signer || !signerAddress) {
      return handleLogout();
    }

    console.log("Entered 2");

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

    console.log(keys);

    const xmtp = await Client.create(null, {
      env: config.xmtp.environment,
      privateKeyOverride: keys,
    });

    setNetworkOn(Boolean(xmtp.address));
    setClient(xmtp);

    console.log(xmtp);

    // if (isConsent) {
    //   //Refresh consent
    //   await xmtp.contacts.refreshConsentList();
    // }
  };

 */
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
