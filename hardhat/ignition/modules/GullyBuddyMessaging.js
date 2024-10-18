// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("GullyBuddyMessagingModule", (m) => {

  // Deploy the GullyBuddyMessaging contract
  const GullyBuddyMessaging = m.contract("GullyBuddyMessaging");

  return { GullyBuddyMessaging };
});

// GullyBuddyMessagingModule#GullyBuddyMessaging - 0xbb1419A01b11795f72744EA554a53edc1392C4dE