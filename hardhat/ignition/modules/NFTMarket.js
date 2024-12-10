// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const config = require("../config");

module.exports = buildModule("NFTMarketModule", (m) => {
  // Define default parameters for the contract
  const CDEToken = m.getParameter("CDEToken",  config.default.CDEToken);
  const TIMToken = m.getParameter("TIMToken",  config.default.TIMToken);
  const ANToken = m.getParameter("ANToken",  config.default.ANToken);
  const owner = m.getParameter("owner",  config.default.tokenOwnerAddress);
  const amountReceiverAddress = m.getParameter("amountReceiverAddress",  config.default.amountReceiverAddress);

  // Deploy the NFTMarket contract
  const nftMarket = m.contract("NFTMarket", [CDEToken,TIMToken,ANToken,owner,amountReceiverAddress]);

  return { nftMarket };
});

// NFTMarketModule#NFTMarket - 0x817c5b580CC6569221fD54E5C3d6215DAe924FA4