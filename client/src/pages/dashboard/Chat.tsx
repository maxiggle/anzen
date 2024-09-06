import ClientList from "../../components/Chat/ClientList";
import Button from "../../components/UI/Button";
import { CachedConversation, useClient } from "@xmtp/react-sdk";
import ChatBox from "../../components/Chat/ChatBox";
import useChatStore from "../../store/useChatStore";
import useInitChat from "../../hooks/useInitChat";
import { useState } from "react";

export default function Chat() {
  const myAddress = useChatStore((state) => state.myAddress);
  const [newAddress, setNewAddress] = useState("");
  const [currentConversation, setCurrentConversation] =
    useState<CachedConversation | null>(null);
  const { client, error, isLoading } = useClient();
  const { handleConnect } = useInitChat();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">
            An error occurred while initializing the client. Please try again
            later.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Initializing Chat
          </h2>
          <p className="text-gray-600 mt-2">Awaiting signatures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-row mb-6 justify-between items-center">
        <h2 className="text-lg font-semibold">Chats</h2>
        <div>
          {!client && (
            <Button
              loading={false}
              onClick={() => handleConnect()}
              variant="primary"
            >
              Connect Chat
            </Button>
          )}
        </div>
      </div>

      {newAddress}

      {client && myAddress ? (
        <div className="flex flex-row w-full gap-5 h-[calc(100vh-200px)]">
          <div className="w-2/3">
            <ChatBox
              userAddress={myAddress}
              newAddress={newAddress}
              conversation={currentConversation}
              setConversation={(c) => setCurrentConversation(() => c)}
            />
          </div>
          <div className="w-1/3">
            <ClientList
              setConversation={(c) => setCurrentConversation(() => c)}
              setNewAddress={(a) => setNewAddress(() => a)}
            />
          </div>
        </div>
      ) : (
        <div>Client not initialized</div>
      )}
    </div>
  );
}
