import { CachedConversation } from "@xmtp/react-sdk";
import { create } from "zustand";

type ChatStore = {
  newAddress: string | null;
  userAddress: string | null;
  conversation: CachedConversation | null;
  setConversation: (conversation: CachedConversation) => void;
  setNewAddress: (newAddress: string) => void;
};

export default create<ChatStore>((set) => ({
  newAddress: null,
  conversation: null,
  userAddress: null,
  setConversation: (conversation: CachedConversation) => set({ conversation }),
  setNewAddress: (newAddress: string) => set({ newAddress }),
}))