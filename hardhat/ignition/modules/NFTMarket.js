// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const config = require("../config");

module.exports = buildModule("NFTMarketModule3", (m) => {
  // Define default parameters for the contract
  const testCDEToken = m.getParameter("testCDEToken",  config.default.testCDEToken);
  const testTIMToken = m.getParameter("testTIMToken",  config.default.testTIMToken);
  const owner = m.getParameter("owner",  config.default.tokenOwnerAddress);

  // Deploy the NFTMarket contract
  const nftMarket = m.contract("NFTMarket", [testCDEToken,testTIMToken,owner]);

  return { nftMarket };
});

// NFTMarketModule#NFTMarket - 0xb8BB77c4e2b0E22AeBcC89A59b53a68D1f31058a