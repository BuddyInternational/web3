// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const config = require("../config");

module.exports = buildModule("NFTMarketModule", (m) => {
  // Define default parameters for the contract
  const testCDEToken = m.getParameter("testCDEToken",  config.default.testCDEToken);
  const testTIMToken = m.getParameter("testTIMToken",  config.default.testTIMToken);
  const testANTToken = m.getParameter("testANTToken",  config.default.testANTToken);
  const owner = m.getParameter("owner",  config.default.tokenOwnerAddress);

  // Deploy the NFTMarket contract
  const nftMarket = m.contract("NFTMarket", [testCDEToken,testTIMToken,testANTToken,owner]);

  return { nftMarket };
});

// NFTMarketModule#NFTMarket - 0x4a670ee2Edf9cF26d4A9a96cd8B1BC7216cB5271