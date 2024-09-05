import Button from "../../components/UI/Button";
import DataTable from "../../components/UI/DataTable";
import { FaPlus } from "react-icons/fa";
import Model from "../../components/UI/Modal";
import { useEffect, useState } from "react";
import CreateContract from "../../components/Modals/CreateContract";
import useContract from "../../hooks/useContract";
import { ContractResult } from "../../utils/types";
import { truncateText } from "../../utils/TextUtils";

export default function Contract() {
  const [show, setShow] = useState(false);
  const [showList, setShowList] = useState(false);
  const { getAllContracts } = useContract();
  const [loading, setLoading] = useState(true);
  const [selectedContractContent, setSelectedContractContent] = useState<
    string | null
  >(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [contracts, setContracts] = useState<any | null>(null);

  useEffect(() => {
    async function loadContracts() {
      try {
        const fetchedContracts = await getAllContracts();
        console.log("Fetched contracts:", fetchedContracts);
        setContracts(fetchedContracts);
      } catch (error) {
        console.error("Failed to fetch contracts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadContracts();
  }, [getAllContracts]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const headers = [
    "S/N",
    "Employee Address",
    "Employer Address",
    "Contract Content",
    "Is Approved",
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function parseContractData(result: any[]): ContractResult[] {
    const contractIds = result[0];
    const contracts = result[1];

    return contractIds.map((id: bigint, index: number) => ({
      contractId: id,
      contract: {
        employeeAddress: contracts[index][0],
        employerAddress: contracts[index][1],
        contractContent: contracts[index][2],
        isApproved: contracts[index][3],
        messages: contracts[index][4],
        messagesCount: contracts[index][5],
      },
    }));
  }

  const contractsData = contracts ? parseContractData(contracts) : [];
  const result = contractsData.map(
    (contract: ContractResult, index: number) => {
      const truncatedContent = truncateText(
        contract.contract.contractContent,
        100
      );
      return {
        "s/n": index + 1,
        "employee address": contract.contract.employeeAddress,
        "employer address": contract.contract.employerAddress,
        "contract content": (
          <span
            onClick={() => {
              setSelectedContractContent(contract.contract.contractContent);
              setShowList(true);
            }}
            className="cursor-pointer text-blue-500"
          >
            {truncatedContent}
          </span>
        ),
        "is approved": contract.contract.isApproved ? "Yes" : "No",
        messages: "",
        "messages count": "",
      };
    }
  );
  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg font-semibold">Contracts</h2>
        <div>
          <Button onClick={() => setShow(true)} variant="primary">
            Generate Contract
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <DataTable
          label={"Contracts"}
          left={
            <div>
              <Button
                variant="primary"
                className="!py-2 flex flex-row gap-1 items-center"
              >
                <FaPlus className="mr-2" />
                Take a loan
              </Button>
            </div>
          }
          data={result}
          headers={headers}
        />
      </div>

      <Model state={show} size="3xl" setState={setShow}>
        <CreateContract />
      </Model>
      <Model state={showList} size="3xl" setState={setShow}>
        {selectedContractContent && (
          <div className="p-4">
            <h3 className="text-xl font-semibold">Contract Content</h3>
            <p className="mt-4">{selectedContractContent}</p>
            <Button onClick={() => setShow(false)} className="mt-4">
              Close
            </Button>
          </div>
        )}
      </Model>
    </div>
  );
}
