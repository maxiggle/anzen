import { Client, useClient } from "@xmtp/react-sdk";
import { useCallback } from "react";
import { connect, loadKeys, storeKeys } from "../utils";
import useChatStore from "../store/useChatStore";

export default function useInitChat() {
  const { client, error, isLoading, initialize } = useClient();
  const setMyAddress = useChatStore((state) => state.setMyAddress);

  const handleConnect = useCallback(async () => {
    const { signer, address } = await connect.viaBrowser();

    let keys = loadKeys(address);
    setMyAddress(address);

    if (!keys) {
      keys = await Client.getKeys(signer, {
        env: "dev",
        skipContactPublishing: true,
        persistConversations: false,
      });
      storeKeys(address, keys);
    }

    await initialize({
      keys,
      signer,
      options: {
        persistConversations: false,
        env: "dev" as "production" | "local" | "dev",
      },
    });
  }, []);

  return {
    handleConnect,
    client,
    error,
    isLoading,
  };
}
