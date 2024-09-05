/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import ClientList from "../../components/Chat/ClientList";
import Button from "../../components/UI/Button";
import { Client } from "@xmtp/xmtp-js";
import { connect } from "../../utils";
import { useClient } from "@xmtp/react-sdk";
import ChatBox from "../../components/Chat/ChatBox";

export default function Chat() {
  const { client, error, isLoading, initialize } = useClient();
  const [userWalletAddress, setUserWalletAddress] = useState("");

  const handleConnect = useCallback(async () => {
    const { signer, address } = await connect.viaBrowser();
    setUserWalletAddress(address);

    const keys = await Client.getKeys(signer, {
      env: "dev",
      skipContactPublishing: true,
      persistConversations: false,
    });

    await initialize({
      keys,
      signer,
      options: {
        persistConversations: false,
        env: "dev" as "production" | "local" | "dev",
      },
    });
  }, []);

  if (error) {
    return "An error occurred while initializing the client";
  }

  if (isLoading) {
    return "Awaiting signatures...";
  }

  return (
    <div className="w-full">
      <div className="flex flex-row mb-6 justify-between items-center">
        <h2 className="text-lg font-semibold">Chats</h2>
        <div>
          <Button
            loading={false}
            onClick={() => handleConnect()}
            variant="primary"
          >
            Connect Chat
          </Button>
        </div>
      </div>

      {client ? (
        <div className="flex flex-row w-full gap-5 h-[calc(100vh-200px)]">
          <div className="w-2/3">
            <ChatBox userAddress={userWalletAddress} />
          </div>
          <div className="w-1/3">
            <ClientList />
          </div>
        </div>
      ) : (
        <div>Client not initialized</div>
      )}
    </div>
  );
}
