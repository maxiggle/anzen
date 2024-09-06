import { ethers } from "ethers";
import config from "../utils/config";
import { EmployerContractStruct } from "../utils/types";

export default function useContract() {
  const provider = new ethers.JsonRpcProvider(config.galadrielRpcUrl);
  const signer = new ethers.Wallet(config.galadrielPrivateKey, provider);
  const employerContract = new ethers.Contract(
    config.employerContractAddress,
    config.employerAbi,
    signer
  );

  async function generateContract(
    employeeAddress: string,
    employeeTerms: string
  ): Promise<{ contractId: number }> {
    try {
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

      const contractId = Number(events[0].args.contractId);
      return { contractId };
    } catch (error) {
      console.error("Error generating contract:", error);
      throw error;
    }
  }

  async function getContractContent(contractId: bigint): Promise<string> {
    console.log("Fetching contract content for contract ID:", contractId);
    try {
      return await employerContract.getContractContent(contractId);
    } catch (error) {
      console.error("Error fetching contract content:", error);
      throw error;
    }
  }
  async function getAllContracts(): Promise<{
    contractIds: number[];
    contracts: EmployerContractStruct[];
    statuses: boolean[];
    createdTimes: number[];
  }> {
    try {
      const result = await employerContract.getAllContracts();

      // Convert BigInts to numbers
      const contractIds = result[0].map((id: bigint) => Number(id));
      const contracts = result[1];
      const statuses = result[2];
      const createdTimes = result[3].map((time: bigint) => Number(time));

      return {
        contractIds,
        contracts,
        statuses,
        createdTimes,
      };
    } catch (error) {
      console.error("Error fetching all contracts:", error);
      throw error;
    }
  }

  async function generateAttestation(contractId: bigint): Promise<bigint> {
    const transactionResponse =
      await employerContract.extractTextFromGeneratedContract(contractId);

    const receipt = await transactionResponse.wait();
    const events = receipt.events?.filter(
      (event: ethers.Log) => event.address === "TextExtracted"
    );
    const attestId = events[0].args.attestId;
    console.log("Attest ID:", attestId);
    return attestId;
  }
  async function getAttestation(contractId: number): Promise<string> {
    return employerContract.getExtractedText(contractId);
  }
  return {
    generateContract,
    getContractContent,
    getAllContracts,
    generateAttestation,
    getAttestation,
  };
}
