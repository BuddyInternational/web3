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

  // Deploy the NFTMarket contract
  const nftMarket = m.contract("NFTMarket", [CDEToken,TIMToken,ANToken,owner]);

  return { nftMarket };
});

// NFTMarketModule#NFTMarket - 0xFed54E0CAb106DF543eFB2829e6c4a033233F7aF