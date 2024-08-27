require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const galadrielDevnet = []
if (process.env.PRIVATE_KEY_GALADRIEL) {
  galadrielDevnet.push(process.env.PRIVATE_KEY_GALADRIEL)
}
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  settings: {
    viaIR: true,
    optimizer: {
      enabled: true,
      runs: 200
    },
    viaIR: true 
  },
   galadriel: {
      chainId: 696969,
      url: "https://devnet.galadriel.com/",
      accounts: galadrielDevnet,
    },
};
