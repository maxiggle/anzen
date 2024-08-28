require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const galadrielDevnet = []
if (process.env.PRIVATE_KEY_GALADRIEL) {
  galadrielDevnet.push(process.env.PRIVATE_KEY_GALADRIEL)
}
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.26",
  networks: {
    hardhat: {
    },
    galadriel: {
      chainId: 696969,
      url: "https://devnet.galadriel.com/",
      accounts: galadrielDevnet,
    },
  },
};
