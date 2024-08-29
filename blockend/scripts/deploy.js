
const { ethers } = require("hardhat");

const oracleAddress = "0x68EC9556830AD097D661Df2557FBCeC166a0A075";

async function main() {

  const lock = await  ethers.deployContract("HRContractAI", [oracleAddress], {});

  await lock.waitForDeployment();

  console.log(
   `deployed to ${lock.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});