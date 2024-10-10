// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const config = require("../config");

module.exports = buildModule("Simple721NFTModule", (m) => {
  
    // Define default parameters for the contract
  const nftName = m.getParameter("nftName",  config.default.nftName);
  const nftSymbol = m.getParameter("nftSymbol",  config.default.nftSymbol);

  // Deploy the Simple721NFTPolygon contract
  const simple721NFT = m.contract("Simple721NFT", [nftName, nftSymbol,""]);

  return { simple721NFT };
});


// 0x567F50fCDAc97FbaD18fDE07EbD0d3e0791CDa27