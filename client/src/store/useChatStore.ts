import { CachedConversation } from "@xmtp/react-sdk";
import { create } from "zustand";

type ChatStore = {
  newAddress: string | null;
  myAddress: string | null;
  conversation: CachedConversation | null;
  setConversation: (conversation: CachedConversation) => void;
  setNewAddress: (newAddress: string) => void;
  setMyAddress: (myAddress: string) => void;
};

export default create<ChatStore>((set) => ({
  newAddress: null,
  conversation: null,
  myAddress: null,
  setConversation: (conversation: CachedConversation) => set({ conversation }),
  setNewAddress: (newAddress: string) => set({ newAddress }),
  setMyAddress: (myAddress: string) => set({ myAddress }),
}))