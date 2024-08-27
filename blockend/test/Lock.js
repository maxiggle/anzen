const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HRContractGenerator", function () {
    let HRContractGenerator, hrContractGenerator, oracle, deployer, hr, employee;

    beforeEach(async function () {
        [deployer, hr, employee] = await ethers.getSigners();

        // Deploy a mock oracle
        const Oracle = await ethers.getContractFactory("MockOracle");
        oracle = await Oracle.deploy();
        await oracle.deployed();

        // Deploy HRContractGenerator
        HRContractGenerator = await ethers.getContractFactory("HRContractGenerator");
        hrContractGenerator = await HRContractGenerator.deploy(oracle.address);
        await hrContractGenerator.deployed();
    });

    it("should deploy the contract and set the initial oracle address", async function () {
        expect(await hrContractGenerator.oracleAddress()).to.equal(oracle.address);
    });

    it("should allow HR to generate a contract", async function () {
        const employeeTerms = "Employee will work full-time.";
        const tx = await hrContractGenerator.connect(hr).generateContract(employee.address, employeeTerms);
        const receipt = await tx.wait();
        
        const contractId = receipt.events.find(e => e.event === 'ContractGenerated').args.contractId;
        const contractRun = await hrContractGenerator.contractRuns(contractId);

        expect(contractRun.employee).to.equal(employee.address);
        expect(contractRun.hr).to.equal(hr.address);
        expect(contractRun.isApproved).to.be.false;
    });

    it("should allow the oracle to respond to contract generation", async function () {
        const employeeTerms = "Employee will work full-time.";
        const tx = await hrContractGenerator.connect(hr).generateContract(employee.address, employeeTerms);
        const receipt = await tx.wait();
        
        const contractId = receipt.events.find(e => e.event === 'ContractGenerated').args.contractId;
        await oracle.setResponse(contractId, "Generated contract content", "");

        await hrContractGenerator.connect(oracle).onOracleOpenAiLlmResponse(contractId, { content: "Generated contract content" }, "");

        const contractContent = await hrContractGenerator.getContractContent(contractId);
        expect(contractContent).to.equal("Generated contract content");
    });

    it("should allow the employee to review and approve the contract", async function () {
        const employeeTerms = "Employee will work full-time.";
        const tx = await hrContractGenerator.connect(hr).generateContract(employee.address, employeeTerms);
        const receipt = await tx.wait();
        
        const contractId = receipt.events.find(e => e.event === 'ContractGenerated').args.contractId;
        await oracle.setResponse(contractId, "Generated contract content", "");
        await hrContractGenerator.connect(oracle).onOracleOpenAiLlmResponse(contractId, { content: "Generated contract content" }, "");

        const reviewQuery = "Is the contract fair?";
        await hrContractGenerator.connect(employee).reviewContract(contractId, reviewQuery);
        
        // Assuming the review process is synchronous for simplicity
        await hrContractGenerator.connect(employee).approveContract(contractId, true);
        const contractRun = await hrContractGenerator.contractRuns(contractId);

        expect(contractRun.isApproved).to.be.true;
    });

    it("should allow the owner to update the oracle address", async function () {
        const newOracle = await ethers.getContractFactory("MockOracle");
        const newOracleInstance = await newOracle.deploy();
        await newOracleInstance.deployed();

        await hrContractGenerator.connect(deployer).setOracleAddress(newOracleInstance.address);
        expect(await hrContractGenerator.oracleAddress()).to.equal(newOracleInstance.address);
    });
});
