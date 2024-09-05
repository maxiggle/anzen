import { ethers } from "ethers";
import config from "../utils/config";
import { ContractResult } from "../utils/types";
import useEventStore from "../store/useEventStore";

export default function useContract() {
  const setContractId = useEventStore((state) => state.setContractId);
  const setContractStatus = useEventStore((state) => state.setContractStatus);
  const provider = new ethers.JsonRpcProvider(config.galadrielRpcUrl);
  const signer = new ethers.Wallet(config.galadrielPrivateKey, provider);
  const employerContract = new ethers.Contract(
    config.employerContractAddress,
    config.employerAbi,
    signer
  );

  async function create(
    employeeAddress: string,
    employeeTerms: string
  ): Promise<bigint> {
    const transaction = await employerContract.generateContract(
      employeeAddress,
      employeeTerms
    );
    const transactionResponse = await transaction.wait();
    const events = transactionResponse.logs
      .map((log: ethers.Log) => {
        try {
          return employerContract.interface.parseLog(log);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
          return null;
        }
      })
      .filter((event: ethers.Log | null) => event !== null);

    return events[0].args.contractId;
  }

  const listenForContractEvents = () => {
    employerContract.on("ContractStatusUpdated", (contractId, status) => {
      console.log(`Contract ID: ${contractId}, New Status: ${status}`);
      setContractId(Number(contractId));
      setContractStatus(Number(status));
    });

    return () => {
      employerContract.removeAllListeners("ContractStatusUpdated");
    };
  };

  async function getContractContent(contractId: number): Promise<string> {
    return employerContract.getContractContent(contractId);
  }

  async function getAllContracts(): Promise<ContractResult> {
    const result = await employerContract.getAllContracts();
    return result;
  }

  async function generateAttestation(contractId: number): Promise<bigint> {
    const attestId = await employerContract.extractTextFromGeneratedContract(
      contractId
    );
    console.log("attestId", attestId);
    return attestId;
  }
  async function getAttestation(contractId: number): Promise<string> {
    return employerContract.getExtractedText(contractId);
  }
  return {
    create,
    getContractContent,
    getAllContracts,
    generateAttestation,
    getAttestation,
    listenForContractEvents,
  };
}
