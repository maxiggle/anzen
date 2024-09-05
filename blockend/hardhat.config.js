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
    sepolia: {
      chainId: 84532,
      url: "https://base-sepolia-rpc.publicnode.com",
      accounts:["659316b841409a9a83e12f67bd8047e88fe09d82318e14892f9d9ef41592a5f0"],
    }
  },
};


// 6a8716666048548bd5f45f4ebcc93418927c0e2d429efe3b9fe9eea78d0644fc