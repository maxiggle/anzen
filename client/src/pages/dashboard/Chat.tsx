import ClientList from "../../components/Chat/ClientList";
import Button from "../../components/UI/Button";
import { useClient } from "@xmtp/react-sdk";
import ChatBox from "../../components/Chat/ChatBox";
import useChatStore from "../../store/useChatStore";
import useInitChat from "../../hooks/useInitChat";

export default function Chat() {
  const myAddress = useChatStore((state) => state.myAddress);
  const { client, error, isLoading } = useClient();
  const { handleConnect } = useInitChat();

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

      {client && myAddress ? (
        <div className="flex flex-row w-full gap-5 h-[calc(100vh-200px)]">
          <div className="w-2/3">
            <ChatBox userAddress={myAddress} />
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
