// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const config = require("../config");

module.exports = buildModule("NFTMarketModule", (m) => {
  // Define default parameters for the contract
  const paymentTestCDEToken = m.getParameter("paymentTestCDEToken",  config.default.paymentTestCDEToken);
  const rewardTesrTIMToken = m.getParameter("rewardTestTIMToken",  config.default.rewardTestTIMToken);
  const owner = m.getParameter("owner",  config.default.tokenOwnerAddress);

  // Deploy the NFTMarket contract
  const nftMarket = m.contract("NFTMarket", [paymentTestCDEToken,rewardTesrTIMToken,owner]);

  return { nftMarket };
});

// NFTMarketModule#NFTMarket - 0x5E1c643C9E88Bf77679254A84A31C020b0CE7C18