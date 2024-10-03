import { VanityModel } from "../models/vanity.js";
import VanityEth from "../libs/VanityEth.js";

// Generate Vanity Address
const generateVanityAddress = (req,res) => {
  const { input, isChecksum = false, isContract = false, count = 1 } = req.body;
  try {
    // Validate input
    if (!VanityEth.isValidHex(input)) {
      return res
        .status(400)
        .json({ error: `${input} is not valid hexadecimal` });
    }

    const results = [];
    let walletsFound = 0;

    // Generate vanity addresses
    const counter = () => {
      // You can add logic here if you want to track the progress
    };

    while (walletsFound < count) {
      const wallet = VanityEth.getVanityWallet(
        input,
        isChecksum,
        isContract,
        counter
      );
      results.push(wallet);
      walletsFound++;
    }
    console.log("Generated wallets:", results);
    res
      .status(200)
      .json({ data: results, message: "Generate vanity address successfully" });
    // res.json(results);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Vanity Address not generated ", error: e.message });
  }
};

// Store Vanity Address
const storeVanityAddress = async (req, res) => {
  const { walletAddress, vanityAddress, vanityPrivateKey } = req.body;
  try {
    const newaddress = new VanityModel({
      walletAddress,
      vanityAddress,
      vanityPrivateKey,
      createdAt: new Date(),
    });
    await newaddress.save();
    res.status(200).json({ message: "Vanity address saved succefully" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Vanity Address not saved ", error: e.message });
  }
};

module.exports = { generateVanityAddress, storeVanityAddress };
