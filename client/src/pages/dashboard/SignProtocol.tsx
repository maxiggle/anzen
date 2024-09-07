import React, { useState, useEffect } from 'react';
import { SignProtocolClient, SpMode, EvmChains, Schema, SchemaItem, Attestation } from "@ethsign/sp-sdk";
import { Address, privateKeyToAccount } from "viem/accounts";
import { KintoAccountInfo } from 'kinto-web-sdk';
import { 
    Button, 
    Card, 
    CardHeader, 
    CardContent, 
    TextField, 
    Select,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import { ethers } from 'ethers';
import { fetchAccountInfo, fetchKYCViewerInfo } from '../kinto/KintoFunctions';
import authService from '../authService';
import useStartExtConversation from '../../hooks/useStartExtConversation';

const privateKey = "0xef060cb7d3f8ec2db57965356a38775806ed527dafe85a1ecee920f1673d4b0d";

const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.baseSepolia,
    account: privateKeyToAccount(privateKey),
});

interface SchemaField {
    name: string;
    type: string;
}

declare global {
    interface Window {
      ethereum?: ethers.Eip1193Provider;
    }
  }
 
  export const cleanAndParseJSON = (jsonString: string) => {
    // Supprimer les balises ```json au début et à la fin
    const cleaned = jsonString.replace(/^```json\n|\n```$/g, '');
    return JSON.parse(cleaned);
  };

  
  
  export const createSchema = async (attestationJsonString: string, signatureCount : any) => {
    try {
      // Nettoyer et parser le JSON
      const attestationJson = cleanAndParseJSON(attestationJsonString);
  
      let schemaItems: SchemaItem[] = Object.entries(attestationJson).map(([key, value]) => ({
        name: key,
        type: "string"  
      }));
  
      if (signatureCount > 0) {
        for (let i = 1; i <= signatureCount; i++) {
          schemaItems.push({ name: `signer${i}Signed`, type: "string" });
          schemaItems.push({ name: `signer${i}Address`, type: "string" });
          schemaItems.push({ name: `signer${i}Signature`, type: "string" });
        }
        // Ajouter le champ status seulement si des signatures sont requises
        schemaItems.push({ name: "status", type: "string" });
      }
  
      const res = await client.createSchema({
        name: 'work contract',
        data: schemaItems,
      });
  
      console.log("Schema created:", res);
      return res.schemaId;
    //   setSchemaId(res.schemaId);
    //   setStatus(`Schema created with ID: ${res.schemaId}`);
    //   setDynamicFields(schemaItems);
    } catch (error) {
      console.error("Error creating schema:", error);
    //   setStatus(`Error creating schema: ${(error as Error).message}`);
    }
  };

//   export const [attestationId, setAttestationId] = useState<string>('');
//   export const [accountInfoView, setAccountInfoView] = useState<KintoAccountInfo | undefined>(undefined);


//   const { startConversation } = useStartExtConversation();



//   export const createAttestation = async (contractData: any, signatureCount : any, signerPublicKeys : any,  : any) => {
//     try {


//         let attestationData: Record<string, any> = { ...contractData };

//         console.log('the attestation data ',attestationData);

//         if (signatureCount > 0) {
//             for (let i = 1; i <= signatureCount; i++) {
//                 if (!signerPublicKeys[i-1] || !ethers.isAddress(signerPublicKeys[i-1])) {
//                     throw new Error(`Invalid public key for signer ${i}`);
//                 }
//                 attestationData[`signer${i}Signed`] = false;
//                 attestationData[`signer${i}Address`] = signerPublicKeys[i-1];
//                 attestationData[`signer${i}Signature`] = "0x";
//             }
//             attestationData.status = "pending_signatures";
//         }

//         console.log("Creating attestation with data:", attestationData);

//         const initialAttestation = await client.createAttestation({
//             idSchema,
//             data: attestationData,
//             indexingValue: '111',
//             recipients: signerPublicKeys,
//             linkedAttestationId: null,
//         });

//         console.log("Attestation created:", initialAttestation);
//         console.log("Full attestation data:", attestationData);
//         setAttestationId(initialAttestation.attestationId);
//         // setStatus(`Initial attestation created with ID: ${initialAttestation.attestationId}`);

//         const accountInfo = await fetchAccountInfo();
//         // setAccountInfoView(accountInfo);
//         // console.log('The account is', accountInfoView)
//         const kycViewerInfo = await fetchKYCViewerInfo(accountInfo.walletAddress as Address);
//         console.log('The wallets are', kycViewerInfo.getWalletOwners)
    
//         for (const signerAddress of signerPublicKeys) {
//             try {
//               const message = `Nouvelle attestation à signer. ID: ${initialAttestation.attestationId}`;
//               const result = await startConversation(signerAddress, message);
//               console.log(`Message sent to ${signerAddress}:`, result);
//             } catch (error) {
//               console.error(`Error sending message to ${signerAddress}:`, error);
//             }
//           }
    
//         // setStatus(prevStatus => `${prevStatus}. Signers have been notified.`);
//     } catch (error) {
//         console.error("Error creating attestation:", error);
//         // setStatus(`Error creating attestation: ${(error as Error).message}`);
//     }
// };

// const { startConversation } = useStartExtConversation();

export const createAttestation = async (
    contractData: any, 
    signatureCount: number, 
    signerPublicKeys: string[], 
    idSchema: string,
    sendMessages: (attestationId: string, signerAddresses: string[]) => Promise<void>
) => {
    try {
        let attestationData: Record<string, any> = { ...contractData };

        console.log('the attestation data ', attestationData);

        if (signatureCount > 0) {
            for (let i = 1; i <= signatureCount; i++) {
                if (!signerPublicKeys[i-1] || !ethers.isAddress(signerPublicKeys[i-1])) {
                    throw new Error(`Invalid public key for signer ${i}`);
                }
                attestationData[`signer${i}Signed`] = false;
                attestationData[`signer${i}Address`] = signerPublicKeys[i-1];
                attestationData[`signer${i}Signature`] = "0x";
            }
            attestationData.status = "pending_signatures";
        }

        console.log("Creating attestation with data:", attestationData);

        const initialAttestation = await client.createAttestation({
            schemaId: idSchema,
            data: attestationData,
            indexingValue: '111',
            recipients: signerPublicKeys,
            linkedAttestationId: null,
        });

        console.log("Attestation created:", initialAttestation);
        console.log("Full attestation data:", attestationData);

        await sendMessages(initialAttestation.attestationId, signerPublicKeys);

        const accountInfo = await fetchAccountInfo();
        const kycViewerInfo = await fetchKYCViewerInfo(accountInfo.walletAddress as Address);
        console.log('The wallets are', kycViewerInfo.getWalletOwners);

    } catch (error) {
        console.error("Error creating attestation:", error);
    }
};



const AttestationApp: React.FC = () => {

    const { startConversation } = useStartExtConversation();

    const sendMessages = async (attestationId: string, signerAddresses: string[]) => {
        for (const signerAddress of signerAddresses) {
            try {
                const message = `Nouvelle attestation à signer. ID: ${attestationId}`;
                const result = await startConversation(signerAddress, message);
                console.log(`Message sent to ${signerAddress}:`, result);
            } catch (error) {
                console.error(`Error sending message to ${signerAddress}:`, error);
            }
        }
    }

    const [schemaId, setSchemaId] = useState<string>('');
    const [attestationId, setAttestationId] = useState<string>('');
    const [contractData, setContractData] = useState<Record<string, any>>({});
    const [status, setStatus] = useState<string>('');
    const [schemaFields, setSchemaFields] = useState<SchemaField[]>([{ name: '', type: '' }]);
    const [schemaName, setSchemaName] = useState<string>('');
    const [dynamicFields, setDynamicFields] = useState<SchemaField[]>([]);
    const [signatureCount, setSignatureCount] = useState<number>(0);
    const [signerPublicKeys, setSignerPublicKeys] = useState<string[]>([]);
    const [accountInfoView, setAccountInfoView] = useState<KintoAccountInfo | undefined>(undefined);
    const [walletViewer, setwalletViewer] = useState([]);

    interface KYCViewerInfo {
        isIndividual: boolean;
        isCorporate: boolean;
        isKYC: boolean;
        isSanctionsSafe: boolean;
        getCountry: string;
        getWalletOwners: Address[];
      }


    const addSchemaField = () => {
        setSchemaFields([...schemaFields, { name: '', type: '' }]);
    };

    const updateSchemaField = (index: number, key: keyof SchemaField, value: string) => {
        const updatedFields = [...schemaFields];
        updatedFields[index][key] = value;
        setSchemaFields(updatedFields);
    };

    const removeSchemaField = (index: number) => {
        const updatedFields = schemaFields.filter((_, i) => i !== index);
        setSchemaFields(updatedFields);
    };

    const createSchema = async () => {
        try {
            let schemaItems: SchemaItem[] = schemaFields.map(field => ({
                name: field.name,
                type: field.type as "string" | "number" | "uint256" | "address" | "bool" | "bytes" | "address[]" | "bool[]" | "uint256[]" | "bytes[]" | "string[]" | "number[]"
            }));

            // Ajouter les champs de signature seulement si signatureCount > 0
            if (signatureCount > 0) {
                for (let i = 1; i <= signatureCount; i++) {
                    schemaItems.push({ name: `signer${i}Signed`, type: "bool" });
                    schemaItems.push({ name: `signer${i}Address`, type: "address" });
                    schemaItems.push({ name: `signer${i}Signature`, type: "bytes" });
                }
                // Ajouter le champ status seulement si des signatures sont requises
                schemaItems.push({ name: "status", type: "string" });
            }

            const res = await client.createSchema({
                name: schemaName,
                data: schemaItems,
            });

            console.log("Schema created:", res);
            setSchemaId(res.schemaId);
            setStatus(`Schema created with ID: ${res.schemaId}`);
            setDynamicFields(schemaItems);
            
        } catch (error) {
            console.error("Error creating schema:", error);
            setStatus(`Error creating schema: ${(error as Error).message}`);
        }
    };
    

    const updateSignerPublicKey = (index: number, value: string) => {
        const updatedKeys = [...signerPublicKeys];
        updatedKeys[index] = value;
        setSignerPublicKeys(updatedKeys);
    };
    
  
    


    const updateContractData = (name: string, value: string) => {
        setContractData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const signAttestation = async (signerIndex: number) => {
        try {
            // Check if MetaMask is installed
            if (typeof window.ethereum === 'undefined') {
                throw new Error("MetaMask is not installed");
            }
    
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
    
            // Create a new ethers provider
            const provider = new ethers.BrowserProvider(window.ethereum);
    
            // Get the signer
            const signer = await provider.getSigner();
    
            // Get the signer's address
            const signerAddress = await signer.getAddress();
    
            // Verify if the signer's address is authorized
            if (signerAddress.toLowerCase() !== signerPublicKeys[signerIndex - 1].toLowerCase()) {
                throw new Error(`Unauthorized signer. Your address (${signerAddress}) is not authorized to sign as Signer ${signerIndex}`);
            }
    
            // Get the current attestation
            const currentAttestation = await client.getAttestation(attestationId);
            if (!currentAttestation) {
                throw new Error("Attestation not found");
            }
    
            console.log("Current attestation before signing:", currentAttestation);
    
            const attestationData = currentAttestation.data as Record<string, any>;
    
            if (attestationData[`signer${signerIndex}Signed`]) {
                throw new Error(`This attestation has already been signed by signer${signerIndex}`);
            }
    
            // Create a message to sign (you might want to customize this based on your needs)
            const message = `Sign attestation ${attestationId} as signer ${signerIndex}`;
    
            // Sign the message
            const signature = await signer.signMessage(message);
    
            const updatedData = {
                ...attestationData,
                [`signer${signerIndex}Signed`]: true,
                [`signer${signerIndex}Address`]: signerAddress,
                [`signer${signerIndex}Signature`]: signature,
            };
    
            // Check if all required signatures are now present
            const allSigned = Array.from({ length: signatureCount }, (_, i) => i + 1)
                .every(i => updatedData[`signer${i}Signed`]);
    
            updatedData.status = allSigned ? "completed" : "pending_signatures";
    
            console.log("Updated attestation data before submission:", updatedData);
    
            const updatedAttestation = await client.createAttestation({
                schemaId: currentAttestation.schemaId,
                data: updatedData,
                indexingValue: '0xeaec938211a3ab271edb1b9fedcfa472db30c02f_0x538cfd76c4b97c5a87e1d5eb2c7d026d08d34a81',
                linkedAttestationId: currentAttestation.linkedAttestationId,
                replacementId: attestationId
            } as Attestation);
    
            console.log("Attestation signed:", updatedAttestation);
            console.log("Full updated attestation data:", updatedData);
            setAttestationId(updatedAttestation.attestationId);
            setStatus(`Attestation signed by signer${signerIndex}. New attestation ID: ${updatedAttestation.attestationId}`);
        } catch (error) {
            console.error("Error signing attestation:", error);
            setStatus(`Error signing attestation: ${(error as Error).message}`);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Interactive Attestation Application</h1>
            
            <Card className="mb-4">
                <CardHeader title="Create Schema" />
                <CardContent>
                    <TextField
                        className="mb-2"
                        placeholder="Schema Name"
                        value={schemaName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchemaName(e.target.value)}
                    />
                    <TextField
                        className="mb-2"
                        type="number"
                        placeholder="Number of Signatures"
                        value={signatureCount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignatureCount(Number(e.target.value))}
                    />
                    {schemaFields.map((field, index) => (
                        <div key={index} className="flex mb-2">
                            <TextField
                                className="mr-2"
                                placeholder="Field Name"
                                value={field.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSchemaField(index, 'name', e.target.value)}
                            />
                            <Select
                                className="mr-2"
                                value={field.type}
                                onChange={(e: SelectChangeEvent<string>) => updateSchemaField(index, 'type', e.target.value)}
                            >
                                <MenuItem value="">Select Type</MenuItem>
                                <MenuItem value="string">String</MenuItem>
                                <MenuItem value="uint256">Uint256</MenuItem>
                                <MenuItem value="bool">Boolean</MenuItem>
                                <MenuItem value="address">Address</MenuItem>
                                <MenuItem value="bytes">Bytes</MenuItem>
                            </Select>
                            <Button onClick={() => removeSchemaField(index)}>Remove</Button>
                        </div>
                    ))}
                    <Button className="mr-2" onClick={addSchemaField}>Add Field</Button>
                    <Button onClick={createSchema}>Create Schema</Button>
                </CardContent>
                <CardContent>
                    Schema ID: {schemaId}
                </CardContent>
            </Card>

            {dynamicFields.length > 0 && (
                <Card className="mb-4">
                    <CardHeader title="Create Attestation" />
                    <CardContent>
                        {dynamicFields.map((field, index) => (
                            <div key={index} className="mb-2">
                                {!field.name.startsWith('signer') && field.name !== 'status' && (
                                    <TextField
                                        label={field.name}
                                        type={field.type === 'uint256' ? 'number' : 'text'}
                                        onChange={(e) => updateContractData(field.name, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                        {Array.from({ length: signatureCount }, (_, i) => (
                            <TextField
                                key={i}
                                className="mb-2"
                                label={`Signer ${i + 1} Public Key`}
                                value={signerPublicKeys[i] || ''}
                                onChange={(e) => updateSignerPublicKey(i, e.target.value)}
                            />
                        ))}
                        <Button onClick={createAttestation}>Create Attestation</Button>
                    </CardContent>
                    <CardContent>
                        Attestation ID: {attestationId}
                    </CardContent>
                </Card>
            )}

            {signatureCount > 0 && (
                <Card className="mb-4">
                    <CardHeader title="Sign Attestation" />
                    <CardContent>
                        {Array.from({ length: signatureCount }, (_, i) => i + 1).map((signerIndex) => (
                            <Button key={signerIndex} className="mr-2" onClick={() => signAttestation(signerIndex)}>
                                Sign as Signer {signerIndex}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader title="Status" />
                <CardContent>
                    {status}
                </CardContent>
            </Card>
        </div>
    );
};

export default AttestationApp;