/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useCallback, useState } from "react";
import Button from "../UI/Button";
import EmojiSelect from "../UI/EmojiSelect";

import {
  CachedConversation,
  Conversation,
  useSendMessage,
} from "@xmtp/react-sdk";
import Messages from "./Messages";
import useStartExtConversation from "../../hooks/useStartExtConversation";

interface IProps {
  userAddress: string;
  newAddress?: string;
  conversation: CachedConversation | Conversation | any | null;
  setConversation: (c: CachedConversation | Conversation) => void;
}

export default function ChatBox({
  userAddress,
  newAddress,
  conversation,
  setConversation,
}: IProps) {
  const { sendMessage } = useSendMessage();

  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");

  const { startConversation } = useStartExtConversation();

  const handleStartConversation = useCallback(
    async (e: React.FormEvent) => {
      try {
        e.preventDefault();

        console.log({ newAddress, message });

        if (newAddress && message) {
          setIsSending(true);
          const res = await startConversation(newAddress, message);

          if (res && res.conversation) {
            console.log(res);

            setConversation(res.conversation);
            res.conversation.send("Connected");
          }

          setIsSending(false);
        }
      } catch (error) {
        console.log({ error });
        handleSendMessage({ preventDefault() {} } as any);
      } finally {
        setIsSending(false);
      }
    },
    [userAddress, newAddress, message]
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
        setMessage("");
      }
    },
    [conversation, message]
  );

  return (
    <div className="w-full flex bg-white relative  max-h-[80vh] h-full border rounded-lg flex-col">
      <div className="flex-grow p-8 w-full  h-full overflow-y-auto">
        {newAddress && (
          <div className="flex flex-col absolute px-5 z-10 left-0 top-0 py-2 right-0 bg-slate-200 self-start items-center justify-center">
            <h1 className="text-xl font-bold mb-4">
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
            <h1 className="text-lg font-bold">
              {conversation.peerAddress.substring(0, 6)}...
              {conversation.peerAddress.substring(
                conversation.peerAddress.length - 4
              )}
            </h1>
          </div>
        )}

        <div className="mt-20">
          {conversation && (
            <Messages
              currentUserAddress={userAddress}
              conversation={conversation}
            />
          )}
        </div>
      </div>

      {isSending && (
        <div className="flex items-center justify-center space-x-2">
          <span>Sending</span>
          <span className="animate-bounce">.</span>
          <span className="animate-bounce animation-delay-200">.</span>
          <span className="animate-bounce animation-delay-400">.</span>
        </div>
      )}

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
