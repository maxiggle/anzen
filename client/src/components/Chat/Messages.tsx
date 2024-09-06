import {
  CachedConversation,
  CachedMessage,
  ContentTypeMetadata,
  DecodedMessage,
  useMessages,
  useStreamMessages,
} from "@xmtp/react-sdk";

import { useCallback, useEffect, useState } from "react";
import Bubble from "./Bubble";

type IProps = {
  conversation: CachedConversation;
  currentUserAddress: string;
};

export default function Messages({ conversation, currentUserAddress }: IProps) {
  const { error, messages, isLoading } = useMessages(conversation);

  const [streamedMessages, setStreamedMessages] = useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (DecodedMessage | CachedMessage<any, ContentTypeMetadata>)[]
  >([]);

  const onMessage = useCallback((message: DecodedMessage) => {
    setStreamedMessages((prev) => {
      if (prev.find((m) => m.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);

  useStreamMessages(conversation, { onMessage });

  useEffect(() => {
    setStreamedMessages([...messages]);
  }, [conversation, messages]);

  if (error) {
    return "An error occurred while loading messages";
  }

  if (isLoading) {
    return "Loading messages...";
  }

  // track streamed messages

  // callback to handle incoming messages

  return (
    <>
      {streamedMessages.map((e, i) => (
        <Bubble
          key={i}
          isUser={e.senderAddress === currentUserAddress}
          time={etime(e)}
          message={e.content}
          status={"ok"}
        />
      ))}
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function etime(e: any) {
  return (e.sent || e.sentAt).toLocaleString();
}
