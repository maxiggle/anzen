import useContract from "../../hooks/useContract";
import Button from "../UI/Button";
import config from "../../utils/config";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import attestationService from "../../pages/dashboard/attestationJsonService";
import useAttestationStore from "../../store/useAttestationStore";
import {createSchema, createAttestation} from "../../pages/dashboard/SignProtocol"
import useStartExtConversation from '../../hooks/useStartExtConversation';


export default function CreateContract() {
  const {
    generateContract,
    getContractContent,
    generateAttestation,
    getAttestation,
  } = useContract();

  const [contractContent, setContractContent] = useState("");
  const [contractTerms, setContractTerms] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [contractId, setContractId] = useState(0);
  const setAttestationJson = useAttestationStore(
    (state) => state.setAttestationJson
  );
  const printTarget = useRef<HTMLDivElement>(null);

  async function handleCreateContractAndReturnContent(): Promise<void> {
    setIsGenerating(true);
    const result = await generateContract(
      config.employeeAddress,
      contractTerms
    );
    await new Promise((resolve) => setTimeout(resolve, 30000));
    const content = await getContractContent(BigInt(result.contractId));

    setContractContent(content);
    setIsGenerating(false);
    setContractId(result.contractId);
  }

  async function sendAttestation(attestationJson: string) {
    try {
      if (!attestationJson) {
        throw new Error("Attestation JSON is not set");
      }
      const attestation = await attestationService.createAttestation(
        JSON.stringify(attestationJson)
      );
      console.log("Attestation created:", attestation.attestationId);
    } catch (error) {
      console.error("Failed to create attestation:", error);
    }
  }

  const { startConversation } = useStartExtConversation();

  const sendMessages = async (attestationId: string, signerAddresses: string[]) => {
    for (const signerAddress of signerAddresses) {
        try {
            const message = `You have a new attestation to sign. ID: ${attestationId}`;
            const result = await startConversation(signerAddress, message);
            console.log(`Message sent to ${signerAddress}:`, result);
        } catch (error) {
            console.error(`Error sending message to ${signerAddress}:`, error);
        }
    }
};

  useEffect(() => {
    if (isPrinting) {
      const printWindow = window.open("", "_blank");
      printWindow?.document.write(`
        <html>
          <head>
            <title>Employment Contract</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              h1 { text-align: center; }
            </style>
          </head>
          <body>
          <div style="text-align: center;">
              <a style="width: 220px; display: inline-flex; mergin-bottom: 8px">
                <img
                  src="/icons/hlogo.png"
                  alt="logo"
                  style="width:100%; height: auto; object-fit:cover"
                />
              </a>
            </div>
            <h1>Employment Offer</h1>
            <div>${printTarget.current?.innerHTML}</div>
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.print();
      setIsPrinting(false);
    }
  }, [isPrinting, contractContent, printTarget]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {contractContent === "" ? (
        <>
          <div>
            <h3 className="font-semibold mb-4 text-lg">Create Your Contract</h3>

            <div className="">
              <label className="block mb-2">Enter Your Terms:</label>
              <textarea
                className="w-full mb-3 p-3 border-2 rounded-lg"
                cols={4}
                rows={4}
                value={contractTerms}
                onChange={(e) => setContractTerms(e.target.value)}
              ></textarea>
            </div>
            <Button
              variant="primary"
              loading={isGenerating}
              onClick={() => handleCreateContractAndReturnContent()}
            >
              Generate
            </Button>
          </div>
        </>
      ) : (
        <div className="">
          <h2 className="text-xl font-semibold mb-4">Employment Contract</h2>
          <div
            ref={printTarget}
            className="border-2 contract border-gray-300 rounded-md p-4 mb-4"
          >
            <ReactMarkdown>{contractContent}</ReactMarkdown>
          </div>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              loading={isGenerating}
              onClick={async () => {
                await generateAttestation(BigInt(contractId)).then(
                  async (id) => {
                      console.log("Attestation ID:", id);
                      await new Promise((resolve) => setTimeout(resolve, 45000));
                      await getAttestation(id).then(async (json) => {
                          console.log("Attestation JSON:", json);
                          setAttestationJson(json);
                          const parsedJson = JSON.parse(json.replace(/^```json\n|\n```$/g, ''));
                          try {
                              const idSchema = await createSchema(JSON.stringify(parsedJson), 1);
                              console.log('the schema id is ', idSchema)
                              if (!idSchema) {
                                  throw new Error("Failed to create schema: idSchema is undefined");
                              }
                              await new Promise((resolve) => setTimeout(resolve, 10000));
                              await createAttestation(
                                  parsedJson, 
                                  1, 
                                  ['0x79edB24F41Ec139dde29B6e604ed52954d643858'], 
                                  idSchema,
                                  sendMessages
                              );
                          } catch (error) {
                              console.error("Error in attestation process:", error);
                          }
                      });
                  }
              );
              }}
            >
              Generate Attestation
            </Button>
            <Button
              variant="outline"
              loading={isGenerating}
              onClick={() => {
                handleCreateContractAndReturnContent();
              }}
            >
              Regenerate
            </Button>
            <Button
              loading={isPrinting}
              variant="primary"
              onClick={() => setIsPrinting(true)}
            >
              Print Contract
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}