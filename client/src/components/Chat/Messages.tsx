import {
  CachedConversation,
  DecodedMessage,
  useMessages,
} from "@xmtp/react-sdk";
import { useCallback } from "react";
import Bubble from "./Bubble";

type IProps = {
  conversation: CachedConversation;
  currentUserAddress: string;
};

export default function Messages({ conversation, currentUserAddress }: IProps) {
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
    <>
      {messages.map((e, i) => (
        <Bubble
          key={i}
          isUser={e.senderAddress === currentUserAddress}
          time={e.sentAt.toLocaleString()}
          message={e.content}
          status={e.status}
        />
      ))}
    </>
  );
}
