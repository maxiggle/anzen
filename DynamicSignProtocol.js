const { SignProtocolClient, SpMode, EvmChains } = require("@ethsign/sp-sdk");
const { privateKeyToAccount } = require("viem/accounts");
const { keccak256, encodeAbiParameters, parseAbiParameters, decodeAbiParameters } = require("viem");
const axios = require("axios");

const privateKey = "privateKey";

const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.baseSepolia,
    account: privateKeyToAccount(privateKey),
});

async function createDynamicSchema({ name, fields, numberOfSignatures }) {
    const paymentFields = [
        { name: "transferFund", type: "bool" },
        { name: "totalAmount", type: "uint256" },
        { name: "amountPerMonth", type: "uint256" },
        { name: "paymentFrequency", type: "string" }, // e.g., "monthly", "annually", "daily"
        { name: "paymentMode", type: "string" }, // e.g., "automatic", "manual"
        { name: "taskBasedPayment", type: "bool" },
        { name: "endDateOfPayment", type: "uint256" }, // UNIX timestamp
        { name: "stopPaymentMode", type: "string" }, // e.g., "manual", "automatic"
        // Add any other relevant fields here
    ];

    const signatureFields = Array.from({ length: numberOfSignatures }, (_, i) => [
        { name: `signer${i + 1}Signed`, type: "bool" },
        { name: `signer${i + 1}Signature`, type: "bytes" }
    ]).flat();

    const schemaFields = [
        ...fields.map(field => ({ name: field.name, type: field.type })),
        ...paymentFields,
        ...signatureFields,
        { name: "status", type: "string" }
    ];

    const res = await client.createSchema({
        name,
        data: schemaFields,
    });

    console.log(`Schema created for ${name} with ID:`, res.schemaId);
    return res.schemaId;
}

async function generateInitialAttestation(schemaId, contractData, numberOfSignatures, recipients) {
    const indexingValue = '111';

    const signatureInitialState = Object.fromEntries(
        Array.from({ length: numberOfSignatures }, (_, i) => [
            [`signer${i + 1}Signed`, false],
            [`signer${i + 1}Signature`, "0x"]
        ]).flat()
    );

    const initialAttestation = await client.createAttestation({
        schemaId,
        data: {
            ...contractData,
            ...signatureInitialState,
            status: "pending_signatures",
        },
        indexingValue: indexingValue,
        recipients : recipients,
        linkedAttestationId: null,
    });

    console.log("Initial attestation generated with ID:", initialAttestation.attestationId);
    console.log("Indexing Value:", indexingValue);
    return initialAttestation;
}

async function signAttestation(attestationId, signerIndex, signature) {
    const currentAttestation = await client.getAttestation(attestationId);
    if (!currentAttestation) {
        throw new Error("Attestation not found");
    }

    if (currentAttestation.data[`signer${signerIndex}Signed`]) {
        throw new Error(`This attestation has already been signed by signer${signerIndex}`);
    }

    const updatedAttestation = await client.createAttestation({
        schemaId: currentAttestation.schemaId,
        data: {
            ...currentAttestation.data,
            [`signer${signerIndex}Signed`]: true,
            [`signer${signerIndex}Signature`]: signature,
            status: Array.from({ length: 2 }, (_, i) => currentAttestation.data[`signer${i + 1}Signed`]).every(Boolean) ? "completed" : "pending_signatures"
        },
        indexingValue: '0xeaec938211a3ab271edb1b9fedcfa472db30c02f_0x538cfd76c4b97c5a87e1d5eb2c7d026d08d34a81',
        linkedAttestationId: currentAttestation.linkedAttestationId,
        replacementId: attestationId
    });

    console.log(`Attestation signed by signer${signerIndex}:`, updatedAttestation.attestationId);
    return updatedAttestation;
}

async function generateFinalAttestation(attestationId, numberOfSignatures) {
    const currentAttestation = await client.getAttestation(attestationId);
    if (!currentAttestation) {
        throw new Error("Attestation not found");
    }

    const indexingValue = '111';

    const allSigned = Array.from({ length: numberOfSignatures }, (_, i) => currentAttestation.data[`signer${i + 1}Signed`]).every(Boolean);

    if (!allSigned) {
        throw new Error("All signers must sign before generating the final attestation");
    }

    const finalData = {
        ...currentAttestation.data,
        status: "completed",
    };

    const finalDataForLog = JSON.parse(JSON.stringify(finalData, (key, value) => (
        typeof value === 'bigint' ? value.toString() : value
    )));

    console.log("Final data object before attestation:", finalDataForLog);
    console.log("Expected schema fields:", Object.keys(finalData));

    const finalAttestation = await client.createAttestation({
        schemaId: currentAttestation.schemaId,
        data: finalData,
        indexingValue: indexingValue,
        linkedAttestationId: currentAttestation.linkedAttestationId,
        replacementId: attestationId
    });

    console.log("Final attestation generated with ID:", finalAttestation.attestationId);
    return finalAttestation;
}

function generateSignature(privateKey, contractData, schemaFields) {
    const account = privateKeyToAccount(privateKey);

    const parameterTypes = schemaFields.map(field => field.type).join(',');
    const parameterNames = schemaFields.map(field => contractData[field.name]);

    const message = keccak256(
        encodeAbiParameters(
            parseAbiParameters(parameterTypes),
            parameterNames
        )
    );

    return account.signMessage({ message });
}

async function getAllEmploymentContracts(schemaId, schemaFields) {
    try {
        const formattedSchemaId = `onchain_evm_84532_${schemaId}`;
        const response = await makeAttestationRequest("index/attestations", {
            method: "GET",
            params: {
                mode: "onchain",
                schemaId: formattedSchemaId,
            },
        });

        if (!response.success || response.data?.total === 0) {
            console.log("No attestations found for this schema.");
            return [];
        }

        console.log(`Found ${response.data.total} attestations.`);
        return response.data.rows.map(attestation => {
            const decodedData = decodeAttestationData(attestation.data, schemaFields);
            return {
                attestationId: attestation.attestationId,
                indexingValue: attestation.indexingValue,
                attester: attestation.attester,
                attestTimestamp: new Date(parseInt(attestation.attestTimestamp)).toISOString(),
                data: decodedData
            };
        });
    } catch (error) {
        console.error("Error fetching employment contracts:", error);
        return [];
    }
}

async function makeAttestationRequest(endpoint, options) {
    const url = `https://testnet-rpc.sign.global/api/${endpoint}`;
    const res = await axios.request({
        url,
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        ...options,
    });
    if (res.status !== 200) {
        throw new Error(JSON.stringify(res.data));
    }
    return res.data;
}

function decodeAttestationData(encodedData, schemaFields) {
    const types = schemaFields.map(field => ({ name: field.name, type: field.type }));
    const decoded = decodeAbiParameters(types, encodedData);

    return types.reduce((acc, field, index) => {
        switch (field.type) {
            case 'uint256':
            case 'uint':
                acc[field.name] = decoded[index].toString();
                break;
            case 'int256':
            case 'int':
                acc[field.name] = decoded[index].toString();
                break;
            case 'bool':
                acc[field.name] = Boolean(decoded[index]);
                break;
            case 'bytes':
                acc[field.name] = decoded[index] ? `0x${Buffer.from(decoded[index]).toString('hex')}` : '0x';
                break;
            case 'address':
                acc[field.name] = `0x${decoded[index].toLowerCase()}`;
                break;
            case 'string':
                acc[field.name] = decoded[index];
                break;
            case 'array':
                acc[field.name] = Array.isArray(decoded[index]) ? decoded[index] : [];
                break;
            default:
                console.warn(`Unhandled type ${field.type}, storing raw value for ${field.name}`);
                acc[field.name] = decoded[index];
                break;
        }
        return acc;
    }, {});
}

async function displayAllContracts(schemaId, schemaFields) {
    const contracts = await getAllEmploymentContracts(schemaId, schemaFields);
    console.log(`Total contracts found: ${contracts.length}`);
    contracts.forEach((contract, index) => {
        console.log(`\nContract ${index + 1}:`);
        console.log(`Attestation ID: ${contract.attestationId}`);
        console.log(`Indexing Value: ${contract.indexingValue}`);
        console.log(`Attester: ${contract.attester}`);
        console.log(`Timestamp: ${contract.attestTimestamp}`);
        console.log("Contract Data:");
        console.log(JSON.stringify(contract.data, null, 2));
    });
}

async function runTest() {
    try {
        const projectSchemaParams = {
            name: "Project Agreement",
            fields: [
                { name: "eventName", type: "string" },
                { name: "eventDate", type: "uint256" },
                { name: "venue", type: "string" },
                { name: "organizerAddress", type: "address" },
                { name: "artistAddress", type: "address" },
                { name: "ticketPrice", type: "uint256" },
                { name: "maxAttendees", type: "uint256" },
                { name: "genres", type: "string[]" },
                { name: "isOutdoor", type: "bool" },
                { name: "requiredEquipment", type: "string" },
                { name: "cancelationFee", type: "uint256" },
                { name: "profitSplitPercentage", type: "uint8" },
                { name: "specialRequirements", type: "string" },
                { name: "merchandiseAllowed", type: "bool" },
                { name: "soundCheckTime", type: "uint256" },
                { name: "contractVersion", type: "string" }
            ],
            numberOfSignatures: 2
        };

        // Create schema and initialize contracts
        const schemaId = await createDynamicSchema(projectSchemaParams);
        const contractData = {
            eventName: "Summer Rhythm Fest",
            eventDate: Math.floor(Date.now() / 1000) + 7776000,
            venue: "Starlight Amphitheater",
            organizerAddress: "0x1234567890123456789012345678901234567890",
            artistAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            ticketPrice: 50000000000000000,
            maxAttendees: 5000,
            genres: ["Rock", "Indie", "Electronic"],
            isOutdoor: true,
            requiredEquipment: "Full PA system, lighting rig, 3 guitar amps, drum kit",
            cancelationFee: 10000000000000000,
            profitSplitPercentage: 70,
            specialRequirements: "Vegan catering, 2 dressing rooms, bottled water",
            merchandiseAllowed: true,
            soundCheckTime: 1234567890,
            contractVersion: "v1.2",

            // Add new payment-related data
            transferFund: true,
            totalAmount: 1000000000000000000, // 1 ETH in wei
            amountPerMonth: 50000000000000000, // 0.05 ETH in wei
            paymentFrequency: "monthly",
            paymentMode: "automatic",
            taskBasedPayment: false,
            endDateOfPayment: Math.floor(Date.now() / 1000) + 31536000, // 1 year from now
            stopPaymentMode: "automatic"
        };

        const initialAttestation = await generateInitialAttestation(schemaId, contractData, projectSchemaParams.numberOfSignatures);
        console.log("Initial attestation created:", initialAttestation);

        const initiatorPrivateKey = '0x1111111111111111111111111111111111111111111111111111111111111111';
        const partnerPrivateKey = '0x2222222222222222222222222222222222222222222222222222222222222222';

        const schemaFields = [
            ...projectSchemaParams.fields,
            { name: "transferFund", type: "bool" },
            { name: "totalAmount", type: "uint256" },
            { name: "amountPerMonth", type: "uint256" },
            { name: "paymentFrequency", type: "string" },
            { name: "paymentMode", type: "string" },
            { name: "taskBasedPayment", type: "bool" },
            { name: "endDateOfPayment", type: "uint256" },
            { name: "stopPaymentMode", type: "string" },
        ];

        const initiatorSignature = await generateSignature(initiatorPrivateKey, contractData, schemaFields);
        const partnerSignature = await generateSignature(partnerPrivateKey, contractData, schemaFields);
        console.log("Initiator Signature:", initiatorSignature);
        console.log("Partner Signature:", partnerSignature);

        const initiatorSigned = await signAttestation(initialAttestation.attestationId, 1, initiatorSignature);
        console.log("Attestation after initiator signature:", initiatorSigned);

        const partnerSigned = await signAttestation(initiatorSigned.attestationId, 2, partnerSignature);
        console.log("Attestation after partner signature:", partnerSigned);

        const finalAttestation = await generateFinalAttestation(partnerSigned.attestationId, projectSchemaParams.numberOfSignatures);
        console.log("Final Attestation:", finalAttestation);

        console.log("Waiting for blockchain confirmation...");
        await new Promise(resolve => setTimeout(resolve, 10000));

        console.log("Displaying all project agreements...");
        await displayAllContracts(schemaId, schemaFields);

    } catch (error) {
        console.error("Test failed:", error);
    }
}

runTest();
