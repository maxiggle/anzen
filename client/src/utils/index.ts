import { BrowserProvider, JsonRpcProvider, Wallet } from "ethers";
import { useLocation } from "react-router-dom";
import config from "./config";

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

export const loadKeys = (walletAddress: string) => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress));
  return val ? Buffer.from(val, ENCODING) : null;
};

export const storeKeys = (walletAddress: string, keys: Buffer): void => {
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

  async viaBrowser() {
    const eth = getEthereumInstance();
    if (!eth) return;

    await window.ethereum!.request({
      method: "eth_requestAccounts",
    });

    const provider = new BrowserProvider(window.ethereum!);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    return {
      address,
      signer,
    };
  },
};
