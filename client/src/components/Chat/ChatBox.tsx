/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useCallback, useState } from "react";
import Button from "../UI/Button";
import EmojiSelect from "../UI/EmojiSelect";
import {
  CachedConversation,
  Conversation,
  useSendMessage,
} from "@xmtp/react-sdk";
import Messages from "./Messages";
import useStartExtConversation from "../../hooks/useStartExtConversation";
import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  Attestation,
} from "@ethsign/sp-sdk";
import { ethers } from "ethers";
import { privateKeyToAccount } from "viem/accounts";
import config from "../../utils/config";

interface IProps {
  userAddress: string;
  newAddress?: string;
  conversation: CachedConversation | Conversation | any | null;
  setConversation: (c: CachedConversation | Conversation) => void;
}

const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.baseSepolia,
  account: privateKeyToAccount(config.signProtocol.privateKey as `0x${string}`),
});

const convertBigIntToString = (obj: any): any => {
  if (typeof obj === "bigint") {
    return obj.toString();
  }
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }
  if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        convertBigIntToString(value),
      ])
    );
  }
  return obj;
};

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
  const [attestationToSign, setAttestationToSign] =
    useState<Attestation | null>(null);
  const [attestationId, setAttestationId] = useState("");

  const handleStartConversation = useCallback(
    async (e: React.FormEvent) => {
      try {
        e.preventDefault();

        if (newAddress && message) {
          setIsSending(true);
          const res = await startConversation(newAddress, message);

          if (res && res.conversation) {
            setConversation(res.conversation);
            res.conversation.send("Connected");
          }
        }
      } catch (error) {
        console.error("Error starting conversation:", error);
      } finally {
        setIsSending(false);
      }
    },
    [newAddress, message, startConversation, setConversation]
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
        try {
          await sendMessage(conversation, message);
        } catch (error) {
          console.error("Error sending message:", error);
        } finally {
          setIsSending(false);
          setMessage("");
        }
      }
    },
    [conversation, message, sendMessage]
  );

  const handleRequestSignature = async () => {
    if (!attestationId) {
      alert("Please enter an attestation ID");
      return;
    }

    setIsSending(true);
    try {
      const attestation = await client.getAttestation(attestationId);
      if (attestation) {
        setAttestationToSign(convertBigIntToString(attestation));
        await sendMessage(
          conversation,
          `Requesting signature for attestation: ${attestationId}`
        );
      } else {
        await sendMessage(
          conversation,
          `Attestation ${attestationId} not found.`
        );
      }
    } catch (error) {
      console.error("Error fetching attestation:", error);
      await sendMessage(conversation, `Error: ${(error as Error).message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleSignAttestation = async () => {
    if (!attestationToSign) return;

    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      console.log("Signer Address:", signerAddress);
      console.log("Original Attestation:", attestationToSign);

      const message = `Sign attestation ${attestationToSign.attestationId}`;
      const signature = await signer.signMessage(message);

      console.log("Signature:", signature);

      const updatedData = {
        ...attestationToSign.data,
      };

      console.log("Updated Data:", updatedData);

      // Log the schema of the attestation
      const schema = await client.getSchema(attestationToSign.schemaId);
      console.log("Attestation Schema:", schema);

      // Compare the fields in the schema with the fields in the updated data
      const schemaFields = schema.data.map((item) => item.name);
      const dataFields = Object.keys(updatedData);

      console.log("Schema Fields:", schemaFields);
      console.log("Data Fields:", dataFields);

      const missingFields = schemaFields.filter(
        (field) => !dataFields.includes(field)
      );
      const extraFields = dataFields.filter(
        (field) => !schemaFields.includes(field)
      );

      console.log("Missing Fields:", missingFields);
      console.log("Extra Fields:", extraFields);

      const updatedAttestation = await client.createAttestation({
        schemaId: attestationToSign.schemaId,
        data: updatedData,
        indexingValue: attestationToSign.indexingValue || "0",
        linkedAttestationId: attestationToSign.linkedAttestationId,
        replacementId: attestationToSign.attestationId,
      });

      console.log("Updated Attestation:", updatedAttestation);

      await sendMessage(
        conversation,
        `Attestation ${attestationToSign.attestationId} signed successfully!`
      );
      setAttestationToSign(null);
      setAttestationId("");
    } catch (error) {
      console.error("Error signing attestation:", error);
      await sendMessage(
        conversation,
        `Error signing attestation: ${(error as Error).message}`
      );
    }
  };

  return (
    <div className="w-full flex bg-white relative max-h-[80vh] h-full border rounded-lg flex-col">
      <div className="flex-grow p-8 w-full h-full overflow-y-auto">
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
        <h3 className="font-bold mb-2">Request Attestation Signature</h3>
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Enter attestation ID"
            value={attestationId}
            onChange={(e) => setAttestationId(e.target.value)}
            className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            variant="secondary"
            onClick={handleRequestSignature}
            disabled={isSending}
            className="rounded-l-none"
          >
            Request Signature
          </Button>
        </div>
      </div>

      {attestationToSign && (
        <div className="p-4 border-t">
          <h3 className="font-bold">Attestation to Sign:</h3>
          <p className="mb-2">ID: {attestationToSign.attestationId}</p>
          <p className="mb-2">Schema ID: {attestationToSign.schemaId}</p>
          <p className="mb-2">
            Data: {JSON.stringify(attestationToSign.data, null, 2)}
          </p>
          <Button onClick={handleSignAttestation} variant="primary">
            Sign with MetaMask
          </Button>
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
              onEmojiSelect={(emoji) => setMessage((prev) => prev + emoji)}
            />
          </div>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
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
