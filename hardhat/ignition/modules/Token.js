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

// CDETokenModule#Token - 0xA260e6D2FA6f1FD7ed176Ac8Ace3eDeEe0DB3deD
// TIMTokenModule#Token - 0xE91491568EBF8f229E6a981BFa6c25F7317823F1