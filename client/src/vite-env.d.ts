/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

import { ethers } from "ethers";

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: Array<any> }) => Promise<any>;
    on: (eventName: string, callback: (...args: any[]) => void) => void;
    removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
    selectedAddress: string | null;
    networkVersion: string;
    chainId: string;
  } | ethers.Eip1193Provider;
}

