import { NFTData } from "../models/nftData.js";

 // Save NFT detail in database
export const saveNFTDetails = async (req, res) => {
  const { nfts, walletAddress, vanityAddress } = req.body;

  if (!nfts || !walletAddress || !vanityAddress) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if the wallet address already exists in the database
    let nftData = await NFTData.findOne({ walletAddress });

    if (nftData) {
      // Update the existing record with new NFTs
      nftData.nfts = nfts;
      await nftData.save();
    } else {
      // Create a new record
      nftData = new NFTModel({ walletAddress, vanityAddress, nfts });
      await nftData.save();
    }

    res.status(201).json({ message: "NFT data saved successfully", nftData });
  } catch (error) {
    console.error("Error saving NFTs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch NFT Data
export const fetchNFTDetails = async (req, res) => {
  const { walletAddress } = req.params;
  try {
    const nfts = await NFTData.find({ walletAddress });
    console.log("nfts-----------",nfts);
    // Check if NFTs are found
    if (nfts.length === 0) {
      return res.status(404).json({ message: 'No NFTs found for this wallet address.' });
    }
    res.status(200).json(nfts);
  } catch (error) {
    console.error('Error fetching NFT details:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};