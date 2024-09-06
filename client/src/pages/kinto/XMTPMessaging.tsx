import React, { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { XMTPProvider, useClient, useConversation, useStartConversation, isValidAddress } from '@xmtp/react-sdk';

const XMTPMessaging: React.FC = () => {
  const { client, initialize } = useClient();
  const { startConversation } = useStartConversation();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [conversation, setConversation] = useState<any>(null);

  // Connect to Ethereum wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('No crypto wallet found');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    return provider.getSigner();
  };

  const handleInitializeClient = async () => {
    try {
      const signer = await connectWallet();
      const options = { env: 'dev' }; // Change to 'production' as needed
      await initialize({ signer, options });
    } catch (error) {
      console.error('Error initializing client:', error);
    }
  };

  const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(e.target.value);
    setConversation(null); // Reset conversation when address changes
  }, []);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!client) {
      await handleInitializeClient();
    }
    
    if (client && recipientAddress && isValidAddress(recipientAddress) && message) {
      try {
        setIsSending(true);
        
        // Start or retrieve the conversation
        if (!conversation) {
          const newConversation = await startConversation(recipientAddress, client);
          setConversation(newConversation);
        }
        
        // Send the message using the conversation
        await conversation.send(message);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <input
        name="addressInput"
        type="text"
        placeholder="Recipient Address"
        value={recipientAddress}
        onChange={handleAddressChange}
        disabled={isSending}
      />
      <input
        name="messageInput"
        type="text"
        placeholder="Type your message"
        value={message}
        onChange={handleMessageChange}
        disabled={isSending}
      />
      <button type="submit" disabled={isSending || !isValidAddress(recipientAddress)}>
        {isSending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

export default XMTPMessaging;