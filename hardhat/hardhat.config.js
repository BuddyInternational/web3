require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.25",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  sourcify: {
    enabled: false,
  },
  networks: {
    hardhat: {
      chainId: 1337,
      // url:" http://127.0.0.1:8545/",
      // accounts:['0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d']
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.NFT_MARKET_CONTRACT_PRIVATE_KEY_SEPOLIA],
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL,
      accounts: [process.env.NFT_MARKET_PRIVATE_KEY_POLYGON],
    },
    polygon_amoy: {
      url: process.env.POLYGON_AMOY_RPC_URL,
      accounts: [process.env.NFT_MARKET_PRIVATE_KEY_POLYGON_AMOY],
    },
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGON_API_KEY,
    }
  },

  paths: {
    artifacts: "../client/src/artifacts",
  },
};
