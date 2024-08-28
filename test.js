const { SignProtocolClient, SpMode, EvmChains } = require("@ethsign/sp-sdk");
const { privateKeyToAccount } = require("viem/accounts");
const { keccak256, encodeAbiParameters, parseAbiParameters, decodeAbiParameters } = require("viem");
const axios = require("axios");

const privateKey = "private_key"; // Replace with your private key
const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.baseSepolia,
    account: privateKeyToAccount(privateKey),
});

async function createEmploymentContractSchema() {
    const res = await client.createSchema({
        name: "Employment Contract",
        data: [
            { name: "employeeLastName", type: "string" },
            { name: "employeeFirstName", type: "string" },
            { name: "jobTitle", type: "string" },
            { name: "startDate", type: "uint256" },
            { name: "salary", type: "uint256" },
            { name: "weeklyHours", type: "uint256" },
            { name: "employeeAddress", type: "address" },
            { name: "hrAddress", type: "address" },
            { name: "contractDetails", type: "string" },
            { name: "status", type: "string" },
            { name: "employeeSigned", type: "bool" },
            { name: "hrSigned", type: "bool" },
            { name: "employeeSignature", type: "bytes" },
            { name: "hrSignature", type: "bytes" },
            { name: "finalizedAt", type: "uint256" }
        ],
    });
    
    console.log("Schema created with ID:", res.schemaId);
    return res.schemaId;
}

async function generateInitialAttestation(schemaId, contractData) {
    const indexingValue = `${contractData.employeeAddress.toLowerCase()}_${contractData.hrAddress.toLowerCase()}`;
    const initialAttestation = await client.createAttestation({
        schemaId,
        data: {
            ...contractData,
            status: "pending_signatures",
            employeeSigned: false,
            hrSigned: false,
            employeeSignature: "0x",
            hrSignature: "0x",
            finalizedAt: 0
        },
        indexingValue: indexingValue
    });

    console.log("Initial attestation generated with ID:", initialAttestation.attestationId);
    console.log("Indexing Value:", indexingValue);
    return initialAttestation;
}

async function signAttestation(attestationId, signerType, signerAddress, signature) {
    const currentAttestation = await client.getAttestation(attestationId);
    
    if (!currentAttestation) {
        throw new Error("Attestation not found");
    }

    if (currentAttestation.data[`${signerType}Signed`]) {
        throw new Error(`This attestation has already been signed by ${signerType}`);
    }

    const updatedAttestation = await client.createAttestation({
        schemaId: currentAttestation.schemaId,
        data: {
            ...currentAttestation.data,
            [`${signerType}Signed`]: true,
            [`${signerType}Signature`]: signature,
            status: currentAttestation.data.employeeSigned && signerType === "hr" ? "completed" : "pending_signatures"
        },
        indexingValue: signerAddress,
        replacementId: attestationId
    });

    console.log(`Attestation signed by ${signerType}:`, updatedAttestation.attestationId);
    return updatedAttestation;
}

async function generateFinalAttestation(attestationId) {
    const currentAttestation = await client.getAttestation(attestationId);
    const indexingValue = `${currentAttestation.data.employeeAddress.toLowerCase()}_${currentAttestation.data.hrAddress.toLowerCase()}`;
    console.log('Indexing Value at the end is ',indexingValue)
    
    if (!currentAttestation) {
        throw new Error("Attestation not found");
    }

    if (!currentAttestation.data.employeeSigned || !currentAttestation.data.hrSigned) {
        throw new Error("Both parties must sign before generating the final attestation");
    }

    const finalAttestation = await client.createAttestation({
        schemaId: currentAttestation.schemaId,
        data: {
            ...currentAttestation.data,
            status: "completed",
            finalizedAt: Math.floor(Date.now() / 1000)
        },
        indexingValue: indexingValue,
        replacementId: attestationId
    });

    console.log("Final attestation generated with ID:", finalAttestation.attestationId);
    return finalAttestation;
}

function generateSignature(privateKey, contractData) {
    const account = privateKeyToAccount(privateKey);
    const message = keccak256(
        encodeAbiParameters(
            parseAbiParameters('string, string, string, uint256, uint256, uint256, address, address, string'),
            [
                contractData.employeeLastName,
                contractData.employeeFirstName,
                contractData.jobTitle,
                BigInt(contractData.startDate),
                BigInt(contractData.salary),
                BigInt(contractData.weeklyHours),
                contractData.employeeAddress,
                contractData.hrAddress,
                contractData.contractDetails
            ]
        )
    );
    return account.signMessage({ message });
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

async function getAllEmploymentContracts(schemaId) {
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
            const decodedData = decodeAttestationData(attestation.data);
            
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

function decodeAttestationData(encodedData) {
    const types = [
        { name: 'employeeLastName', type: 'string' },
        { name: 'employeeFirstName', type: 'string' },
        { name: 'jobTitle', type: 'string' },
        { name: 'startDate', type: 'uint256' },
        { name: 'salary', type: 'uint256' },
        { name: 'weeklyHours', type: 'uint256' },
        { name: 'employeeAddress', type: 'address' },
        { name: 'hrAddress', type: 'address' },
        { name: 'contractDetails', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'employeeSigned', type: 'bool' },
        { name: 'hrSigned', type: 'bool' },
        { name: 'employeeSignature', type: 'bytes' },
        { name: 'hrSignature', type: 'bytes' },
        { name: 'finalizedAt', type: 'uint256' }
    ];

    const decoded = decodeAbiParameters(types, encodedData);

    return types.reduce((acc, field, index) => {
        if (field.type === 'uint256') {
            acc[field.name] = decoded[index].toString(); // Convert BigInt to string
        } else if (field.type === 'bytes') {
            acc[field.name] = decoded[index] ? `0x${Buffer.from(decoded[index]).toString('hex')}` : '0x'; // Convert Buffer to hex string or '0x' if null
        } else {
            acc[field.name] = decoded[index];
        }
        return acc;
    }, {});
}

async function displayAllContracts(schemaId) {
    const contracts = await getAllEmploymentContracts(schemaId);
    
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
        const schemaId = await createEmploymentContractSchema();

        const contractData = {
            employeeLastName: "Doe",
            employeeFirstName: "John",
            jobTitle: "Software Engineer",
            startDate: Math.floor(Date.now() / 1000),
            salary: 100000,
            weeklyHours: 40,
            employeeAddress: "public key",
            hrAddress: "public key",
            contractDetails: "This is a sample employment contract for John Doe..."
        };

        const initialAttestation = await generateInitialAttestation(schemaId, contractData);
        console.log("Initial attestation created:", initialAttestation);

        const employeePrivateKey = '0x1111111111111111111111111111111111111111111111111111111111111111';
        const hrPrivateKey = '0x2222222222222222222222222222222222222222222222222222222222222222';

        const employeeSignature = await generateSignature(employeePrivateKey, contractData);
        const hrSignature = await generateSignature(hrPrivateKey, contractData);

        console.log("Employee Signature:", employeeSignature);
        console.log("HR Signature:", hrSignature);

        const employeeSigned = await signAttestation(initialAttestation.attestationId, "employee", contractData.employeeAddress, employeeSignature);
        console.log("Attestation after employee signature:", employeeSigned);

        const hrSigned = await signAttestation(employeeSigned.attestationId, "hr", contractData.hrAddress, hrSignature);
        console.log("Attestation after HR signature:", hrSigned);

        const finalAttestation = await generateFinalAttestation(hrSigned.attestationId);
        console.log("Final Attestation:", finalAttestation);

        console.log("Displaying all employment contracts...");
        await displayAllContracts(schemaId);

    } catch (error) {
        console.error("Test failed:", error);
    }
}

runTest();