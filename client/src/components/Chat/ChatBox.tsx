/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useCallback, useState } from "react";
import Button from "../UI/Button";
import EmojiSelect from "../UI/EmojiSelect";

import {
  useSendMessage,
  useStartConversation,
} from "@xmtp/react-sdk";
import useChatStore from "../../store/useChatStore";
import Messages from "./Messages";

interface IProps {
  userAddress: string;
}

export default function ChatBox({ userAddress }: IProps) {
  const newAddress = useChatStore((state) => state.newAddress);
  const conversation = useChatStore((state) => state.conversation);

  const { startConversation } = useStartConversation();
  const { sendMessage } = useSendMessage();

  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleStartConversation = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (newAddress && message) {
        setIsSending(true);
        await startConversation(newAddress, message);
        setIsSending(false);
      }
    },
    [userAddress, startConversation]
  );

  const handleMessageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (conversation && message) {
        setIsSending(true);
        await sendMessage(conversation, message);
        setIsSending(false);
      }
    },
    [conversation, message]
  );

  return (
    <div className="w-full flex bg-white relative  border rounded-lg flex-col">
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
          <div className="flex flex-col px-5 py-3 items-center absolute z-10 w-full left-0 bg-white top-0 self-start justify-center">
            <p>You are now chatting with</p>
            <h1 className="text-lg font-bold">{conversation.peerAddress}</h1>
          </div>
        )}

        {conversation && (
          <Messages
            currentUserAddress={userAddress}
            conversation={conversation}
          />
        )}
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
