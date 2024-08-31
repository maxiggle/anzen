const { ModelManager, Factory, Serializer } = require('@accordproject/concerto-core');
const fs = require('fs');
const path = require('path');
const { Template } = require('@accordproject/cicero-core');

// Initialize ModelManager
const modelManager = new ModelManager();

// Paths to the required model files
const runtimeCtoPath = path.join(__dirname, 'model', 'runtime.cto');
const contractCtoPath = path.join(__dirname, 'model', 'contract.cto');
const baseCtoPath = path.join(__dirname, 'model', 'base.cto');
const customCtoPath = path.join(__dirname, 'model', 'model.cto');
const templatePath = path.join(__dirname, 'model', 'EmploymentContractTemplate');

// Read the .cto files as text
const runtimeModel = fs.readFileSync(runtimeCtoPath, 'utf8');
const contractModel = fs.readFileSync(contractCtoPath, 'utf8');
const baseModel = fs.readFileSync(baseCtoPath, 'utf8');
const customModel = fs.readFileSync(customCtoPath, 'utf8');

// Add the required model files to the ModelManager
try {
    modelManager.addModelFiles([baseModel, runtimeModel, contractModel, customModel], ['base.cto', 'runtime.cto', 'contract.cto', 'model.cto']);
    modelManager.validateModelFiles(); 
} catch (error) {
    console.error('Error adding or validating model file:', error.message);
    process.exit(1);
}

// Initialize Factory and Serializer
const factory = new Factory(modelManager);
const serializer = new Serializer(factory, modelManager);

// Load Cicero Template
async function loadTemplate() {
    const template = await Template.fromDirectory(templatePath);
    await template.compile(modelManager);
    return template;
}

// Function to handle sign request
async function handleSignRequest(request) {
    const { signatories } = request;
    const contract = request.contract;

    if (signatories.length >= 2) {  // Assuming at least 2 signatories required
        contract.contractRequestLifecycleState = 'SIGNED';
        contract.dateSigned = new Date().toISOString();

        // Generate the natural language contract text
        const template = await loadTemplate();
        const clause = template.createClause(); // Adjust according to the actual method to create a clause
        clause.setData(contract);

        const text = await clause.render(); // Adjust according to the actual method to render the text
        console.log('Generated Contract Text:\n', text);
    } else {
        throw new Error('Not enough signatories.');
    }

    return contract;
}

// Example usage
async function main() {
    // Create example signatories
    const employer = factory.newResource('org.datasurge.employment', 'Party', '1');
    employer.participantName = 'Employer';
    employer.participantRole = 'Employer';

    const employee = factory.newResource('org.datasurge.employment', 'Party', '2');
    employee.participantName = 'Employee';
    employee.participantRole = 'Employee';

    // Create contract
    const contract = factory.newResource('org.datasurge.employment', 'EmploymentContractModel', 'Contract1');
    contract.startDate = new Date().toISOString();
    contract.endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();
    contract.employer = employer;
    contract.employee = employee;
    contract.jobTitle = 'Developer';
    contract.jobDescription = 'Software Developer';
    contract.salary = 60000;
    contract.paymentFrequency = 'Monthly';
    contract.contractTerms = 'Standard terms';

    // Create sign request
    const signRequest = factory.newTransaction('org.datasurge.employment', 'SignRequest');
    signRequest.contract = contract;
    signRequest.signatories = [employer, employee];

    try {
        const updatedContract = await handleSignRequest(signRequest);
        console.log('Contract signed:', updatedContract);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
