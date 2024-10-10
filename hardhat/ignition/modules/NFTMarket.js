// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const config = require("../config");

module.exports = buildModule("NFTMarketModule", (m) => {
  // Define default parameters for the contract
  const owner = m.getParameter("owner",  config.default.tokenOwnerAddress);
  const paymentTestCDEToken = m.getParameter("paymentTestCDEToken",  config.default.paymentTestCDEToken);
  const rewardTesrTIMToken = m.getParameter("rewardTestTIMToken",  config.default.rewardTestTIMToken);

  // Deploy the NFTMarket contract
  const nftMarket = m.contract("NFTMarket", [paymentTestCDEToken,rewardTesrTIMToken,owner]);

  return { nftMarket };
});

// NFTMarketModule#NFTMarket - 0xdcD5eC1cd8d5a35C8aeD722d66b768eCd01bd6dC