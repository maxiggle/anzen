export interface Invoice {
  id: number;
  customer: string;
  amount: number;
  date: string;
}



export interface Message {
  role: string;
  content: { contentType: string; value: string }[];
}

export enum ContractStatus {
  Pending,
  Completed,
  Failed,
  EmptyResponse
}
export interface ContractData {
  contractId: number;
  employee: string;
  hr: string;
  contractContent: string;
  isApproved: boolean;
  createdAt: number;
}export interface ContractResult {
  contractId: bigint;
  contract: {
    employee: string;
    hr: string;
    contractContent: string;
    isApproved: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: any[]; // You might want to define a more specific type for messages
    messagesCount: bigint;
    createdAt: bigint;
    isTextExtraction: boolean;
    status: ContractStatus;
  };
  isApproved: boolean;
  createdTime: bigint;
}

export interface EmployerContractStruct {
  status: number;
  employee: string;
  hr: string;
  isApproved: boolean;
  contractContent: string;
  createdAt: number;
  messagesCount: number;
  // Add any other fields that are part of the EmployerContractStruct
}