import React, { useState } from 'react';
import { SignProtocolClient, SpMode, EvmChains, Schema, SchemaItem, Attestation } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { 
    Button, 
    Card, 
    CardHeader, 
    CardContent, 
    CardActions, 
    TextField, 
    Select,
    MenuItem,
    TextareaAutosize,
    SelectChangeEvent
} from '@mui/material';

const privateKey = "private_key";

const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.baseSepolia,
    account: privateKeyToAccount(privateKey),
});

interface SchemaField {
    name: string;
    type: string;
}

const AttestationApp: React.FC = () => {
    const [schemaId, setSchemaId] = useState<string>('');
    const [attestationId, setAttestationId] = useState<string>('');
    const [contractData, setContractData] = useState<Record<string, any>>({});
    const [status, setStatus] = useState<string>('');
    const [schemaFields, setSchemaFields] = useState<SchemaField[]>([{ name: '', type: '' }]);
    const [schemaName, setSchemaName] = useState<string>('');

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
            const schemaItems: SchemaItem[] = schemaFields.map(field => ({
                name: field.name,
                type: field.type as "string" | "number" | "uint256" | "address" | "bool" | "bytes" | "address[]" | "bool[]" | "uint256[]" | "bytes[]" | "string[]" | "number[]"
            }));

            const res = await client.createSchema({
                name: schemaName,
                data: schemaItems,
            });

            setSchemaId(res.schemaId);
            setStatus(`Schema created with ID: ${res.schemaId}`);
        } catch (error) {
            setStatus(`Error creating schema: ${(error as Error).message}`);
        }
    };

    const createAttestation = async () => {
        try {
            const initialAttestation = await client.createAttestation({
                schemaId,
                data: {
                    ...contractData,
                    signer1Signed: false,
                    signer1Signature: "0x",
                    signer2Signed: false,
                    signer2Signature: "0x",
                    status: "pending_signatures",
                },
                indexingValue: '111',
                recipients: [],
                linkedAttestationId: null,
            });

            setAttestationId(initialAttestation.attestationId);
            setStatus(`Initial attestation created with ID: ${initialAttestation.attestationId}`);
        } catch (error) {
            setStatus(`Error creating attestation: ${(error as Error).message}`);
        }
    };

    const signAttestation = async (signerIndex: number) => {
        try {
            const currentAttestation = await client.getAttestation(attestationId);
            if (!currentAttestation) {
                throw new Error("Attestation not found");
            }

            const attestationData = currentAttestation.data as Record<string, any>;

            if (attestationData[`signer${signerIndex}Signed`]) {
                throw new Error(`This attestation has already been signed by signer${signerIndex}`);
            }

            // In a real app, you'd generate a proper signature here
            const dummySignature = "0x1234567890abcdef";

            const updatedAttestation = await client.createAttestation({
                schemaId: currentAttestation.schemaId,
                data: {
                    ...attestationData,
                    [`signer${signerIndex}Signed`]: true,
                    [`signer${signerIndex}Signature`]: dummySignature,
                    status: attestationData.signer1Signed && attestationData.signer2Signed ? "completed" : "pending_signatures"
                },
                indexingValue: '0xeaec938211a3ab271edb1b9fedcfa472db30c02f_0x538cfd76c4b97c5a87e1d5eb2c7d026d08d34a81',
                linkedAttestationId: currentAttestation.linkedAttestationId,
                replacementId: attestationId
            } as Attestation);

            setAttestationId(updatedAttestation.attestationId);
            setStatus(`Attestation signed by signer${signerIndex}. New attestation ID: ${updatedAttestation.attestationId}`);
        } catch (error) {
            setStatus(`Error signing attestation: ${(error as Error).message}`);
        }
    };

    const generateFinalAttestation = async () => {
        try {
            const currentAttestation = await client.getAttestation(attestationId);
            if (!currentAttestation) {
                throw new Error("Attestation not found");
            }

            const attestationData = currentAttestation.data as Record<string, any>;

            if (!attestationData.signer1Signed || !attestationData.signer2Signed) {
                throw new Error("All signers must sign before generating the final attestation");
            }

            const finalAttestation = await client.createAttestation({
                schemaId: currentAttestation.schemaId,
                data: {
                    ...attestationData,
                    status: "completed",
                },
                indexingValue: '111',
                linkedAttestationId: currentAttestation.linkedAttestationId,
                replacementId: attestationId
            } as Attestation);

            setAttestationId(finalAttestation.attestationId);
            setStatus(`Final attestation generated with ID: ${finalAttestation.attestationId}`);
        } catch (error) {
            setStatus(`Error generating final attestation: ${(error as Error).message}`);
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

            <Card className="mb-4">
                <CardHeader title="Create Attestation" />
                <CardContent>
                    <TextareaAutosize
                        className="mb-2"
                        placeholder="Enter contract data as JSON"
                     />
                    <Button onClick={createAttestation}>Create Attestation</Button>
                </CardContent>
                <CardContent>
                    Attestation ID: {attestationId}
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardHeader title="Sign Attestation" />
                <CardContent>
                    <Button className="mr-2" onClick={() => signAttestation(1)}>Sign as Signer 1</Button>
                    <Button onClick={() => signAttestation(2)}>Sign as Signer 2</Button>
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardHeader title="Generate Final Attestation" />
                <CardContent>
                    <Button onClick={generateFinalAttestation}>Generate Final Attestation</Button>
                </CardContent>
            </Card>

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
