// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const config = require("../config");

module.exports = buildModule("ANTTokenModule", (m) => {
  // Define default parameters for the contract
  const name = m.getParameter("name",  config.default.name);
  const symbol = m.getParameter("symbol",  config.default.symbol);

  // Deploy the TimToken contract
  const Token = m.contract("Token", [name, symbol]);

  return { Token };
});

// CDETokenModule#Token - 0xE4f65aa51311e03bEA21477b348044AcaD5E5eDE
// TIMTokenModule#Token - 0x78F46490e5a47378cB971Bfa6bC752F421F0b921
// ANTTokenModule#Token - 0x97BCC8096779D9A3754ff61A7CcD6E97cfAC7c5c