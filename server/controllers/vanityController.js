import { VanityData } from "../models/vanity.js";
import VanityEth from "../libs/VanityEth.js";

// Generate and Store Vanity Address
export const generateAndStoreVanityAddress = async (req, res) => {
  const {
    suffix,
    isChecksum = true,
    isContract = false,
    count = 1,
    walletAddress,
  } = req.body;
  try {
    // Validate suffix
    if (!VanityEth.isValidHex(suffix)) {
      return res
        .status(400)
        .json({ error: `${suffix} is not valid hexadecimal` });
    }

    const results = [];
    let walletsFound = 0;

    // Generate vanity addresses
    const counter = () => {
      // You can add logic here if you want to track the progress
    };

    while (walletsFound < count) {
      const wallet = VanityEth.getVanityWallet(
        suffix,
        isChecksum,
        isContract,
        counter
      );

      results.push(wallet);

      // Store each generated wallet's details in the database
      const newAddress = new VanityData({
        walletAddress,
        vanityAddress: wallet.address,
        vanityPrivateKey: wallet.privKey,
        createdAt: new Date(),
      });
      console.log("newAddress-----------", newAddress);
      await newAddress.save();

      walletsFound++;
    }

    console.log("Generated wallets:", results);
    res.status(200).json({
      data: results,
      message: "Vanity address generated and saved successfully",
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Vanity Address not generated", error: e.message });
  }
};

export const generateVanityWallet = async (req, res) => {
  const { suffix, isChecksum = true, isContract = false, count = 1 } = req.body;
  try {
    // Validate suffix
    if (!VanityEth.isValidHex(suffix)) {
      return res
        .status(400)
        .json({ error: `${suffix} is not valid hexadecimal` });
    }

    const results = [];
    let walletsFound = 0;

    // Generate vanity addresses
    const counter = () => {
      // Optional: add logic to track progress
    };

    while (walletsFound < count) {
      const wallet = VanityEth.getVanityWallet(suffix, isChecksum, isContract, counter);
      results.push(wallet);
      walletsFound++;
    }

    console.log("Generated wallets:", results);
    res.status(200).json({
      data: results,
      message: "Vanity wallets generated successfully",
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error generating vanity wallets", error: e.message });
  }
};

export const storeVanityWallet = async (req, res) => {
  const { walletAddress, vanityAddress, vanityPrivateKey } = req.body;

  try {
    // Create and save the new vanity wallet record in the database
    const newAddress = new VanityData({
      walletAddress,
      vanityAddress,
      vanityPrivateKey,
      createdAt: new Date(),
    });

    await newAddress.save();
    console.log("Stored new vanity address:", newAddress);
    
    res.status(200).json({
      message: "Vanity wallet stored successfully",
      data: newAddress,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error storing vanity wallet",
      error: e.message,
    });
  }
};

// Check if a vanity address exists for a given wallet address
export const checkExistingVanityAddress = async (req, res) => {
  const { walletAddress } = req.query;
  try {
    const existingEntry = await VanityData.findOne({ walletAddress });

    if (existingEntry) {
      console.log("address found----------", existingEntry);
      return res.status(200).json({
        message: "Vanity address found",
        vanityAddress: existingEntry.vanityAddress,
        vanityPrivateKey: existingEntry.vanityPrivateKey,
      });
    } else {
      return res
        .status(404)
        .json({ message: "No vanity address found for this wallet" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error checking vanity address", error: e.message });
  }
};
