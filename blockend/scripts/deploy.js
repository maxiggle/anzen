
const { ethers } = require("hardhat");

const oracleAddress = "0x68EC9556830AD097D661Df2557FBCeC166a0A075";

async function main() {

  // const automatedContract = await ethers.deployContract("AutomatedMonthlyTransfer",["0xb8FCeb74C6c7e9DEaAcE41060747670d43475997","0x636D04C4FaBfb59EB7EC8FC8eD7F484323990AB4"],{});
  // await automatedContract.waitForDeployment();
  // console.log(
  //   `Automated contract deployed to ${automatedContract.target}`
  // );

  const textStorage = await  ethers.deployContract("TextStorage");
  await textStorage.waitForDeployment();
  console.log(
    `Text storage deployed to ${textStorage.target}`
   );

  const employer = await  ethers.deployContract("EmployerContract",[oracleAddress, textStorage.target], {});
  await employer.waitForDeployment();
  console.log(
   `employer contract deployed to ${employer.target}`
  );

  const employerTarget = "0xa676B5B3afB00C838B42e0aaBa56753a923aB9EF";
  const employee = await  ethers.deployContract("EmployeeContract", [oracleAddress, employer.target, textStorage.target], {});
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