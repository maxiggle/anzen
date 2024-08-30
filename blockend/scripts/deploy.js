
const { ethers } = require("hardhat");

const oracleAddress = "0x68EC9556830AD097D661Df2557FBCeC166a0A075";

async function main() {

  const employer = await  ethers.deployContract("EmployerContract", [oracleAddress], {});
  await employer.waitForDeployment();
  console.log(
    `deployed to ${employer.target}`
   );
  const employee = await  ethers.deployContract("EmployeeContract", [oracleAddress, employer.target], {});
  await employee.waitForDeployment();
  console.log(
    `deployed to ${employee.target}`
   );



  

  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});