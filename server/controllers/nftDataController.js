import { NFTData } from "../models/nftData.js";

// Save NFT detail in database
export const saveNFTDetails = async (req, res) => {
  try {
    const { walletAddress, vanityAddress, nft } = req.body; 

    // Check if a record already exists with the provided wallet address
    let nftDetail = await NFTData.findOne({ walletAddress });

    if (!nftDetail) {
      // If it doesn't exist, create a new record
      nftDetail = new NFTData({
        walletAddress,
        vanityAddress,
        nfts: [nft], 
      });
      await nftDetail.save();
      return res.status(201).json(nftDetail);
    } else {
      // If it exists, check if the NFT already exists in the nfts array
      const nftExists = nftDetail.nfts.some(existingNft => existingNft.tokenId === nft.tokenId && existingNft.contractAddress === nft.contractAddress);

      if (!nftExists) {
        // If it does not exist, push the new NFT into the existing nfts array
        nftDetail.nfts.push(nft);
        await nftDetail.save();
        return res.status(200).json(nftDetail);
      }
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error creating or updating NFT detail.', error });
  }
};

// Fetch NFT Data
export const fetchNFTDetails = async (req, res) => {
  const { walletAddress } = req.params;
  try {
    const nfts = await NFTData.find({ walletAddress });
    // Check if NFTs are found
    if (nfts.length === 0) {
      return res
        .status(404)
        .json({ message: "No NFTs found for this wallet address." });
    }
    res.status(200).json(nfts);
  } catch (error) {
    console.error("Error fetching NFT details:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Update NFT claim details
export const updateNFTClaimDetails = async (req, res) => {
  const {
    walletAddress,
    tokenId,
    contractAddress,
    lastclaimedAt,
    totalClaimedRewardHash,
  } = req.body;

  if (!walletAddress || !tokenId || !contractAddress) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Find the NFT record for the given wallet address and the specific NFT (tokenId and contractAddress)
    const nftData = await NFTData.findOne({ walletAddress });

    if (!nftData) {
      return res.status(404).json({ error: "NFT data not found" });
    }

    // Find the specific NFT to update
    const nftIndex = nftData.nfts.findIndex(
      (nft) =>
        nft.tokenId === tokenId && nft.contractAddress === contractAddress
    );

    if (nftIndex === -1) {
      return res.status(404).json({ error: "NFT not found" });
    }

    // Update only the specific fields without affecting other fields
    if (lastclaimedAt) {
      nftData.nfts[nftIndex].lastclaimedAt = lastclaimedAt;
    } else {
      nftData.nfts[nftIndex].lastclaimedAt = new Date();
    }

    // Increment the totalClaimedRewardCount
    nftData.nfts[nftIndex].totalClaimedRewardCount =
      (nftData.nfts[nftIndex].totalClaimedRewardCount || 0) + 1;

    // Append new totalClaimedRewardHash to the existing array
    if (totalClaimedRewardHash && Array.isArray(totalClaimedRewardHash)) {
      nftData.nfts[nftIndex].totalClaimedRewardHash = [
        ...(nftData.nfts[nftIndex].totalClaimedRewardHash || []),
        ...totalClaimedRewardHash,
      ];
    }

    // Save the updated NFT data in the database
    await nftData.save();

    res
      .status(200)
      .json({ message: "NFT claim details updated successfully", nftData });
  } catch (error) {
    console.error("Error updating NFT claim details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// fetch the NFT Claim Detail
export const getNFTClaimDetails = async (req, res) => {
  const { walletAddress, tokenId, contractAddress } = req.params;

  try {
    // Fetch claim details for the specified wallet address
    const claimDetails = await NFTData.findOne({
      walletAddress,
    });

    if (!claimDetails) {
      return res
        .status(404)
        .json({ message: "No claim details found for this wallet." });
    }

    // Filter the NFTs array for the specified tokenId and contractAddress
    const nftDetails = claimDetails.nfts.find(
      (nft) =>
        nft.tokenId === tokenId && nft.contractAddress === contractAddress
    );

    if (!nftDetails) {
      return res
        .status(404)
        .json({ message: "No claim details found for this NFT." });
    }

    // Return the NFT details
    return res.status(200).json(nftDetails);
  } catch (error) {
    console.error("Error fetching claim details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
