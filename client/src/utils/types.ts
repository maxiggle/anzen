export interface Invoice {
  id: number;
  customer: string;
  amount: number;
  date: string;
}

export interface EmployerContractStruct {
  employee: string;
  hr: string;
  contractContent: string;
  isApproved: boolean;
  messages: Message[];
  messagesCount: bigint;
  createdAt: bigint;
}

export interface Message {
  role: string;
  content: { contentType: string; value: string }[];
}



export interface ContractData {
  employeeAddress: string;
  employerAddress: string;
  contractContent: string;
  isApproved: boolean;
  messages: unknown; // We'll leave this as 'any' for now since it's not needed
  messagesCount: bigint;
}

export interface ContractResult {
  contractId: bigint;
  contract: ContractData;
  isApproved: boolean;
  createdTime: bigint;
}