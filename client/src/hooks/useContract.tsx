import { ethers } from "ethers";
import config from "../utils/config";

export default function useContract() {
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

  async function getContractContent(contractId: number): Promise<string> {
    return employerContract.getContractContent(contractId);
  }
  return {
    create,
    getContractContent,
  };
}
