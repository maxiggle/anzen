/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useCallback, useEffect, useState } from "react";
import Bubble from "../../components/Chat/Bubble";
import ClientList from "../../components/Chat/ClientList";
import Button from "../../components/UI/Button";
import EmojiSelect from "../../components/UI/EmojiSelect";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import { BrowserProvider } from "ethers";
import { connect } from "../../utils";
import usePersistentState from "../../hooks/usePersistentState";
import config from "../../utils/config";
import { isValidAddress, useCanMessage, useClient } from "@xmtp/react-sdk";

export default function Chat() {
  const { client, error, isLoading, initialize } = useClient();
  const { canMessage } = useCanMessage();

  const [isLoading, setIsLoading] = useState(false);
  const [isOnNetwork, setIsOnNetwork] = useState(false);

  const [peerAddress, setPeerAddress] = useState("");

  const handleAddressChange = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement> & { target: { value: string } }
    ) => {
      setPeerAddress(e.target.value);
    },
    []
  );

  const handleCheckAddress = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (isValidAddress(peerAddress)) {
        setIsLoading(true);
        setIsOnNetwork(await canMessage(peerAddress));
        setIsLoading(false);
      } else {
        setIsOnNetwork(false);
      }
    },
    [peerAddress]
  );

  const handleConnect = useCallback(async () => {
    const { signer, address } = await connect.viaBrowser();
    const options = {
      persistConversations: false,
      env: "dev" as "production" | "local" | "dev",
    };
    const keys = await Client.getKeys(signer, {
      env: "dev",
      skipContactPublishing: true,
      persistConversations: false,
    });
    await initialize({ keys, options, signer });
  }, [initialize]);

  if (error) {
    return "An error occurred while initializing the client";
  }

  if (isLoading) {
    return "Awaiting signatures...";
  }

  return (
    <div>
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
          {/* {walletConnected && (
            <Button loading={false} variant="primary">
              Disconnect Chat
            </Button>
          )} */}
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* Client list */}
        <div className="w-1/4 ">
          <ClientList
            onTyping={handleAddressChange}
            onSearch={handleCheckAddress}
            query={peerAddress}
          />
        </div>

        <div className="w-3/4 flex bg-white border rounded-lg flex-col">
          {/* <div className="flex-grow p-8  overflow-y-auto">
            {messages.map((e, i) => (
              <Bubble
                key={i}
                isUser={e.isUser}
                message={e.message}
                time={e.time}
                status={e.status}
              />
            ))}
          </div> */}

          {peerAddress}

          <div className="p-4 border-t">
            <div className="flex items-center">
              <button className="mr-2 text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>
              <div className="mr-2 mt-1 text-gray-500 hover:text-gray-700">
                <EmojiSelect
                  onEmojiSelect={(e) => {
                    console.log(e);
                  }}
                />
              </div>
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={() => {}}
                variant="primary"
                className="rounded-l-none"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
