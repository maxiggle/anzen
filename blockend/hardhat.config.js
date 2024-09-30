require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

const galadrielDevnet = [];
if (process.env.PRIVATE_KEY_GALADRIEL) {
  galadrielDevnet.push(process.env.PRIVATE_KEY_GALADRIEL);
}
module.exports = {
  solidity: "0.8.27",
  networks: {
    hardhat: {},
    galadriel: {
      chainId: 696969,
      url: "https://devnet.galadriel.com/",
      accounts: galadrielDevnet,
    },
  },
};
