import { JsonRpcSigner } from "ethers";
import { useState } from "react";
import usePersistentState from "./usePersistentState";
import { connect, loadKeys, storeKeys } from "../utils";
import { Client } from "@xmtp/xmtp-js";
import config from "../utils/config";

export default function useXMTPChat() {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [client, setClient] = useState<Client | null>(null);
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

    setNetworkOn(!!xmtp.address);
    setClient(xmtp);
    // if (isConsent) {
    //   //Refresh consent
    //   await xmtp.contacts.refreshConsentList();
    // }
  };
  return {
    walletConnected,
    setWalletConnected,
    setSignerAddress,
    signerAddress,
    initXmtpWithKeys,
    startConnection,
    xmtp: client,
    setSigner,
    networkOn,
    signer,
  };
}
