/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useCallback, useState } from "react";
import Button from "../UI/Button";
import EmojiSelect from "../UI/EmojiSelect";
import Bubble from "./Bubble";
import {
  // DecodedMessage,
  // isValidAddress,
  useMessages,
  useSendMessage,
  useStartConversation,
} from "@xmtp/react-sdk";
import useChatStore from "../../store/useChatStore";

export default function ChatBox({ userAddress: ua }: any) {
  const newAddress = useChatStore((state) => state.newAddress);
  const conversation = useChatStore((state) => state.conversation);
  const userAddress = useChatStore((state) => state.userAddress);
  const { startConversation } = useStartConversation();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  // const [cmessage, setCMessage] = useState("");
  // const [loading, setLoading] = useState(false);

  const handleStartConversation = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("STarting", newAddress, message);

      if (newAddress && message) {
        setIsSending(true);
        await startConversation(newAddress, message);
        setIsSending(false);
      }
    },
    [userAddress, startConversation]
  );

  // Messages

  const { sendMessage } = useSendMessage();

  const handleMessageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Entering...", message, conversation);

      if (conversation && message) {
        setIsSending(true);
        await sendMessage(conversation, message);
        setIsSending(false);
      }
    },
    [message, userAddress, sendMessage]
  );

  // const error = null;
  // const messages = [] as any[];
  // // const isLoading = false;
  const { error, messages, isLoading } = useMessages(conversation, {
    onError: useCallback((err: Error) => {
      console.log({ err });
    }, []),
    onMessages: useCallback((msgs: DecodedMessage[]) => {
      console.log({ msgs });
    }, []),
  });

  if (error) {
    return "An error occurred while loading messages";
  }

  if (isLoading) {
    return "Loading messages...";
  }

  return (
    <div className="w-3/4 flex bg-white border rounded-lg flex-col">
      <div className="flex-grow p-8 w-full  max-h-[80vh] overflow-y-auto">
        {newAddress && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">
              You are now chatting with {newAddress}
            </h1>
            <p className="text-gray-600 mb-4">
              Start a conversation by typing a message below.
            </p>
          </div>
        )}

        {conversation && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-lg font-bold mb-4">
              You are now chatting with {conversation.peerAddress}
            </h1>
            <p className="text-gray-600 mb-4">
              Start a conversation by typing a message below. ---
            </p>
          </div>
        )}

        {/* <button onClick={handleStartConversation}>Start A Conversationn</button> */}
        {messages.map((e, i) => (
          <>
            {e.senderAddress === ua ? "true" : "false"}
            <Bubble
              key={i}
              isUser={e.senderAddress === ua}
              time={e.sentAt.toLocaleString()}
              message={e.content}
              status={e.status}
            />
          </>
        ))}
      </div>

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
          {isSending ? <>Sending...</> : null}
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
            onChange={handleMessageChange}
            className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            variant="primary"
            onClick={(e) =>
              newAddress ? handleStartConversation(e) : handleSendMessage(e)
            }
            disabled={isSending}
            className="rounded-l-none"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
