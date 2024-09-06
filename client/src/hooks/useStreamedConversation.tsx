/* eslint-disable @typescript-eslint/no-explicit-any */
import { Conversation, Stream, useClient } from "@xmtp/react-sdk";
import { useEffect, useState } from "react";

export default function useStreamedConversation() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation<any>[]>([]);
  const { client } = useClient();

  useEffect(() => {
    let isMounted = true;
    let stream: Stream<Conversation<any>, any>;

    if (!client) {
      return alert("Client not initialized");
    }

    const fetchAndStreamConversations = async () => {
      setLoading(true);
      const allConversations = await client.conversations.list();

      const sortedConversations = allConversations.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      if (isMounted) setConversations(sortedConversations);
      setLoading(false);
      stream = await client.conversations.stream();
      for await (const conversation of stream) {
        console.log(
          `New conversation started with ${conversation.peerAddress}`
        );
        if (isMounted) {
          setConversations((prevConversations) => {
            const newConversations = [...prevConversations, conversation];
            return newConversations.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
          });
        }
        break;
      }
    };

    fetchAndStreamConversations();

    return () => {
      isMounted = false;
      if (stream) {
        stream.return();
      }
    };
  }, []);

  return {
    conversations,
    loading,
  };
}
