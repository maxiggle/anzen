import { isValidAddress, useClient } from "@xmtp/react-sdk";

/// Transfermessage(0x2345,’test message’)
export default function useStartExtConversation() {
  const { client } = useClient();

  const startConversation = async (address: string, message: string) => {
    if (!client) return;
    if (!isValidAddress(address)) alert("invalid address");
    if (!(await client.canMessage(address))) {
      alert("conversation request cannot be sent");
    }
    const conversation = await client.conversations.newConversation(address);
    await conversation.send(message);
  };
  return {
    startConversation,
  };
}
