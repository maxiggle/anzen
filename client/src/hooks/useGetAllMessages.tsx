import { DecodedMessage, useStreamAllMessages } from "@xmtp/react-sdk";
import { useCallback, useState } from "react";

export default function useGetAllMessages() {
  const [streamedMessages, setStreamedMessages] = useState<DecodedMessage[]>(
    []
  );

  // callback to handle incoming messages
  const onMessage = useCallback(
    (message: DecodedMessage) => {
      setStreamedMessages((prev) => [...prev, message]);
    },
    [streamedMessages]
  );

  useStreamAllMessages(onMessage);

  return {
    streamedMessages,
  };
}
