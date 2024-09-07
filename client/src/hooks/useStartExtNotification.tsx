import { useCallback } from "react";
import { isValidAddress, useClient } from "@xmtp/react-sdk";

// Hook definition
export function useStartExtNotification() {
  const { client } = useClient();

  const startConversation = useCallback(
    async (address: string, message: string) => {
      if (!client) return;
      if (!isValidAddress(address)) {
        alert("invalid address");
        return;
      }
      if (!(await client.canMessage(address))) {
        alert("conversation request cannot be sent");
        return;
      }

      for (const conversation of await client.conversations.list()) {
        if (conversation.peerAddress === address) {
          await conversation.send(message);
          return { conversation };
        }
      }

      const conversation = await client.conversations.newConversation(address);
      await conversation.send(message);

      return { conversation };
    },
    [client]
  );

  return { startConversation };
}
