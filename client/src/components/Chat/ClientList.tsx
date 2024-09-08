/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CachedConversation,
  isValidAddress,
  useCanMessage,
  useConversations,
} from "@xmtp/react-sdk";
import React, { FormEvent, useCallback, useState } from "react";
import useStreamedConversation from "../../hooks/useStreamedConversation";

type ChangeEvent = React.ChangeEvent<HTMLInputElement> | undefined;

interface IProps {
  setConversation: (conversation: CachedConversation) => void;
  setNewAddress: (address: string) => void;
}

export default function ClientList({ setConversation, setNewAddress }: IProps) {
  const [showButton, setShowButton] = useState(false);
  const [peerAddress, setPeerAddress] = useState("");
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [innerMessage, setInnerMessage] = useState("");

  const { canMessage } = useCanMessage();
  const { conversations: streamedConversation } = useStreamedConversation();

  const {
    error,
    conversations,
    isLoading: loadingConversations,
  } = useConversations();

  const handleAddressChange = useCallback((e: ChangeEvent) => {
    setPeerAddress(e!.target.value);
  }, []);

  const handleCheckAddress = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setInnerMessage("");
      setIsLoading(true);

      const checkAddressForExistingConversation = (address: string) => {
        if (conversations && conversations.length === 0) {
          setNewAddress(peerAddress);
          return;
        }

        if (conversations && conversations.length > 0) {
          const conversation = conversations.find(
            (c) => c.peerAddress === address
          );
          if (!conversation) {
            setNewAddress(peerAddress);
            console.log({ new: peerAddress });
          } else {
            setConversation(conversation);
          }
        }
      };

      try {
        if (!isValidAddress(peerAddress)) {
          setIsOnNetwork(false);
          return;
        }

        if (await canMessage(peerAddress)) {
          checkAddressForExistingConversation(peerAddress);
          setIsOnNetwork(true);
        } else {
          setInnerMessage("Address not on network");
        }
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    },
    [peerAddress, canMessage]
  );
  if (loadingConversations) {
    return (
      <div className="flex items-center justify-center h-full max-h-[300px] bg-white p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600 font-medium">
          Loading conversations...
        </span>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className=" border rounded-lg bg-white border-gray-200 mr-4 overflow-y-auto">
      <h3 className="text-lg font-semibold p-4 border-b border-gray-200">
        Clients
      </h3>

      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <svg
            className="animate-spin h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}
      {isOnNetwork && (
        <div className="flex items-center justify-center p-4 bg-green-100 text-green-700 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-semibold">Network is active</span>
        </div>
      )}

      <div className="p-4 border-b border-gray-200">
        <div className="relative flex">
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={peerAddress}
            onChange={handleAddressChange}
            onBlur={() => setShowButton(true)}
            onFocus={() => setShowButton(false)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {showButton && peerAddress && (
            <button
              onClick={handleCheckAddress}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          )}
        </div>
      </div>

      {innerMessage && (
        <div className="p-4 border-b border-gray-200">
          <div className="text-red-500">{innerMessage}</div>
        </div>
      )}

      {loadingConversations ? (
        <div>Loading...</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {[...streamedConversation].map((e, i) => (
            <li
              key={i}
              onClick={() => setConversation(e as any)}
              className="p-4 hover:bg-gray-200 cursor-pointer transition gap-3 duration-150 ease-in-out flex items-center"
            >
              <div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold border border-blue-600">
                  {e.peerAddress.charAt(0)}x{e.peerAddress.charAt(2)}
                </div>
              </div>
              <span className=" flex w-full text-xs break-all">
                {e.peerAddress}
              </span>
              {!conversations.find((c) => c.peerAddress === e.peerAddress) && (
                <div className="flex items-center">
                  <span className="bg-green-600 w-4 h-4 flex rounded-full">
                    &nbsp;
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
