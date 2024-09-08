import Button from "../../components/UI/Button";
import DataTable from "../../components/UI/DataTable";
import { FaPlus } from "react-icons/fa";
import Model from "../../components/UI/Modal";
import { useEffect, useState, useCallback } from "react";
import CreateContract from "../../components/Modals/CreateContract";
import useContract from "../../hooks/useContract";
import { ContractData } from "../../utils/types";
import { truncateText } from "../../utils";
import AttestationApp from "./SignProtocol";

export default function Contract() {
  const [show, setShow] = useState(false);
  const [showList, setShowList] = useState(false);
  const { getAllContracts } = useContract();
  const [loading, setLoading] = useState(true);
  const [selectedContractContent, setSelectedContractContent] = useState<
    string | null
  >(null);

  const [contracts, setContracts] = useState<ContractData[]>([]);

  const loadContracts = useCallback(async () => {
    try {
      const { contractIds, contracts, statuses, createdTimes } =
        await getAllContracts();
      const formattedContracts = contractIds.map((id, index) => ({
        contractId: id,
        employee: contracts[index].employee,
        hr: contracts[index].hr,
        contractContent: contracts[index].contractContent,
        isApproved: statuses[index],
        createdAt: createdTimes[index],
      }));
      setContracts(formattedContracts);
    } catch (error) {
      console.error("Failed to load contracts:", error);
    } finally {
      setLoading(false);
    }
  }, [getAllContracts]);

  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const headers = [
    "Contract ID",
    "Employee Address",
    "Employer Address",
    "Contract Content",
    "Is Approved",
    "Created At",
  ];

  const tableData = contracts.map((contract) => ({
    "Contract ID": contract.contractId,
    "Employee Address": contract.employee,
    "Employer Address": contract.hr,
    "Contract Content": (
      <span
        onClick={() => {
          setSelectedContractContent(contract.contractContent);
          setShowList(true);
        }}
        className="cursor-pointer text-blue-500"
      >
        {truncateText(contract.contractContent, 50)}
      </span>
    ),
    "Is Approved": contract.isApproved ? "Yes" : "No",
    "Created At": new Date(contract.createdAt * 1000).toLocaleString(),
  }));

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
          data={tableData}
          headers={headers}
        />
      </div>

      {/* First Modal */}
      <Model state={show} size="3xl" setState={setShow}>
        <CreateContract />
      </Model>

      {/* Second Modal */}
      <Model state={showList} size="3xl" setState={setShowList}>
        {selectedContractContent && (
          <div className="p-4">
            <h3 className="text-xl font-semibold">Contract Content</h3>
            <p className="mt-4">{selectedContractContent}</p>
            <Button onClick={() => setShowList(false)} className="mt-4">
              Close
            </Button>
          </div>
        )}
      </Model>
    </div>
  );
}
