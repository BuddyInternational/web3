// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const config = require("../config");

module.exports = buildModule("TIMTokenModule", (m) => {
  // Define default parameters for the contract
  const name = m.getParameter("name",  config.default.name);
  const symbol = m.getParameter("symbol",  config.default.symbol);

  // Deploy the TimToken contract
  const Token = m.contract("Token", [name, symbol]);

  return { Token };
});

// CDETokenModule#Token - 0xDd6762eBbF55Dc89810b20d91f5E2AceDc2712FB
// TIMTokenModule#Token - 0x6462F3d6BcB8D03E6c7ee9ee21420A3fc82468ab