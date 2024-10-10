// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const config = require("../config");

module.exports = buildModule("TokenModule1", (m) => {
  // Define default parameters for the contract
  const name = m.getParameter("name",  config.default.name);
  const symbol = m.getParameter("symbol",  config.default.symbol);

  // Deploy the TimToken contract
  const Token = m.contract("Token", [name, symbol]);

  return { Token };
});

// TokenModule#TokenCDE - 0xE69A3E3eDAFc4a643c72BaD8E704638b7566C0EC
// TokenModule1#TokenTIM - 0x45AF5A31bc2C53c08D1326C627594Df2f99c92B0