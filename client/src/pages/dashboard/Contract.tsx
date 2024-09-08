import Button from "../../components/UI/Button";
import DataTable from "../../components/UI/DataTable";
import { FaPlus } from "react-icons/fa";
import Model from "../../components/UI/Modal";
import { useEffect, useState, useCallback } from "react";
import CreateContract from "../../components/Modals/CreateContract";
import useContract from "../../hooks/useContract";
import { ContractData, RegisterRole } from "../../utils/types";
import { truncateText } from "../../utils";
import ReactMarkdown from "react-markdown";
import { useProfileStore } from "../../store/useProfileStore";
import ReviewContract from "../../components/Modals/ReviewContract";

export default function Contract() {
  const [cshow, setCShow] = useState(false);
  const [show, setShow] = useState(false);
  const [showList, setShowList] = useState(false);
  const user = useProfileStore((state) => state.user);
  const { getAllContracts } = useContract();
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(
    null
  );

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
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>

        <span className="mt-4 text-xl text-gray-600 font-medium">
          Loading contracts...
        </span>
      </div>
    );
  }

  const headers = [
    "Contract ID",
    ...(user?.role === RegisterRole.Company
      ? ["Employee Address", "Contract Content"]
      : ["Employer Address"]),

    "Is Approved",
    "Created At",
    "Actions",
  ];

  const tableData = contracts.map((contract) => ({
    "Contract ID": contract.contractId,
    ...(user?.role === RegisterRole.Company
      ? {
          "Employee Address": (
            <span className="break-all w-full flex">{contract.employee}</span>
          ),
          "Contract Content": (
            <span
              onClick={() => {
                setSelectedContract(contract);
                setShowList(true);
              }}
              className="cursor-pointer content text-left text-blue-500"
            >
              <ReactMarkdown>
                {truncateText(contract.contractContent, 50)}
              </ReactMarkdown>
            </span>
          ),
        }
      : {
          "Employer Address": (
            <span className="break-all w-full text-center flex">
              {contract.hr}
            </span>
          ),
        }),
    "Is Approved": contract.isApproved ? "Yes" : "No",
    "Created At": new Date(contract.createdAt * 1000).toLocaleString(),
    Actions: (
      <div className="flex items-center justify-center">
        <Button
          variant="primary"
          className="!py-2"
          onClick={() => {
            setSelectedContract(contract);
            setShowList(true);
          }}
        >
          View
        </Button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg font-semibold">Contracts</h2>
        <div>
          {user?.role !== RegisterRole.Contractor && (
            <Button onClick={() => setShow(true)} variant="primary">
              Generate Contract
            </Button>
          )}
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
        {/* <AttestationApp /> */}
      </div>

      {/* First Modal */}
      <Model state={show} size="3xl" setState={setShow}>
        <CreateContract />
      </Model>

      {/* Second Modal */}
      <Model state={showList} size="3xl" setState={setShowList}>
        {selectedContract && (
          <div className="border-2 contract bg-white border-gray-300 rounded-md p-4 mb-4">
            <h3 className="text-xl font-semibold contract">Contract Content</h3>

            <ReactMarkdown>{selectedContract.contractContent}</ReactMarkdown>
            <div className="mt-8 flex items-center gap-3 flex-row justify-end">
              <Button onClick={() => setShowList(false)}>Close</Button>
              <Button
                onClick={() => {
                  setCShow(true);
                }}
                variant="outline"
              >
                Review Contract
              </Button>
            </div>
          </div>
        )}
      </Model>
      {selectedContract && (
        <Model state={cshow} size="3xl" setState={setCShow}>
          <ReviewContract contract={selectedContract} />
        </Model>
      )}
    </div>
  );
}
