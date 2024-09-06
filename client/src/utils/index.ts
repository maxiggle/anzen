import { BrowserProvider, JsonRpcProvider, Wallet } from "ethers";
import { useLocation } from "react-router-dom";
import config from "./config";
import { Signer } from "ethers";

export const ENCODING = "binary";
export function isLinkActive(location: ReturnType<typeof useLocation>) {
  return (path: string) => {
    return location.pathname === path;
  };
}

export function clsx(obj: Record<string, boolean> | string[] | (string | undefined | boolean)[] = []): string {
  if (Array.isArray(obj)) {
    return obj.filter((e) => e).join(" ");
  }

  if (typeof obj === 'object') {
    return Object.entries(obj).filter(([_cls, state]: [string, boolean]) => state && _cls).map(([_class]: [string, boolean]) => _class).join(' ')
  }

  return '';
}

const getEthereumInstance = () => {
  return typeof window !== "undefined" && window.ethereum;
};

export const getEnv = () => {
  // "dev" | "production" | "local"
  return typeof process !== "undefined" && config.xmtp.environment
    ? config.xmtp.environment
    : "production";
};

export const buildLocalStorageKey = (walletAddress: string) => {
  return walletAddress ? `xmtp:${getEnv()}:keys:${walletAddress}` : "";
};

export const loadKeys = (address: string): Uint8Array | null => {
  const val = localStorage.getItem(buildLocalStorageKey(address));
  return val ? Buffer.from(val, ENCODING) : null;
};

export const storeKeys = (walletAddress: string, keys: Uint8Array): void => {
  localStorage.setItem(
    buildLocalStorageKey(walletAddress),
    Buffer.from(keys).toString(ENCODING)
  );
};

export const wipeKeys = (walletAddress: string): void => {
  localStorage.removeItem(buildLocalStorageKey(walletAddress));
};

export const connect = {
  async viaJsonRPC() {
    const provider = new JsonRpcProvider(config.xmtp.kintoRPCURL);
    const wallet = new Wallet(config.xmtp.kintoPrivateKey, provider);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    return {
      address,
      signer,
      wallet,
    };
  },

  async viaBrowser(): Promise<{ address: string; signer: Signer; }> {
    const eth = getEthereumInstance();
    if (!eth) throw new Error("No Ethereum provider found");

    await window.ethereum!.request({
      method: "eth_requestAccounts",
    });

    const provider = new BrowserProvider(window.ethereum!);
    const signer = await provider.getSigner() as Signer;
    const address = await signer.getAddress();

    return {
      address,
      signer,
    };
  },
};


export const isValidEthereumAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const getRelativeTimeLabel = (dateString: string) => {
  const diff = new Date().getTime() - new Date(dateString).getTime();
  const diffMinutes = Math.floor(diff / 1000 / 60);
  const diffHours = Math.floor(diff / 1000 / 60 / 60);
  const diffDays = Math.floor(diff / 1000 / 60 / 60 / 24);
  const diffWeeks = Math.floor(diff / 1000 / 60 / 60 / 24 / 7);

  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
};