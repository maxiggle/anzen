
const { ethers } = require("hardhat");

const oracleAddress = "0x0352b37E5680E324E804B5A6e1AddF0A064E201D";

async function main() {

  // const automatedContract = await ethers.deployContract("AutomatedMonthlyTransfer",["0xb8FCeb74C6c7e9DEaAcE41060747670d43475997","0x636D04C4FaBfb59EB7EC8FC8eD7F484323990AB4"],{});
  // await automatedContract.waitForDeployment();
  // console.log(
  //   `Automated contract deployed to ${automatedContract.target}`
  // );

  // const textStorage = await  ethers.deployContract("TextStorage");
  // await textStorage.waitForDeployment();
  // console.log(
  //   `Text storage deployed to ${textStorage.target}`
  //  );

  // const employer = await  ethers.deployContract("EmployerContract",[oracleAddress, textStorage.target], {});
  // await employer.waitForDeployment();
  // console.log(
  //  `employer contract deployed to ${employer.target}`
  // );

  const employerTarget = "0xeD14f90A55F3E29B4F60B3563fC46374e83A0da8";
  const employee = await  ethers.deployContract("EmployeeContract", [oracleAddress, employerTarget, "0x5A4890424E4f2bD0d9ff8E3eAD2F1BE2991CD0C6"], {});
  await employee.waitForDeployment();
  console.log(
    `employee contract deployed to ${employee.target}`
   );

  //  const schema = await  ethers.deployContract("ContractSchema");
  // await schema.waitForDeployment();
  // console.log(
  //   `deployed to ${schema.target}`
  //  );

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});