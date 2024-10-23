import { SocketNFTData } from "../models/SocketNFT.js";

// Save Socket NFT detail in database
export const saveSocketNFTAndUpdateLastTransfer = async (req, res) => {
  const { walletAddress, vanityAddress, nft } = req.body;

  if (!walletAddress || !vanityAddress || !nft) {
    return res.status(400).json({
      message: "Wallet address, vanity address, and NFT details are required.",
    });
  }

  try {
    const socketNFT = await SocketNFTData.findOneAndUpdate(
      { walletAddress, vanityAddress },
      {
        // Update lastTransferDetails with the new NFT
        lastTransferDetails: {
          nftAddress: nft.nftAddress,
          name: nft.name,
          chainName: nft.chainName,
          mediaType: nft.mediaType,
          imageUrl: nft.imageUrl,
          tokenId: nft.tokenId,
          transferDate: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    return res
      .status(200)
      .json({ message: "Socket NFT data saved successfully", socketNFT });
  } catch (error) {
    console.error("Error saving SocketNFTs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch the Last Transfer nft Details
export const getSocketNFTLastTransferDetails = async (req, res) => {
  const { vanityAddress } = req.body;
  try {
    if (vanityAddress !== 0x0000000000000000000000000000000000000000) {
      const socketNFT = await SocketNFTData.findOne(
        { vanityAddress },
        { lastTransferDetails: 1 }
      );

      // if (!socketNFT) {
      //   return res.status(404).json({
      //     message: "No NFT details found for this wallet and vanity address.",
      //   });
      // }
      if (socketNFT) {
        return res.status(200).json(socketNFT.lastTransferDetails);
      }
    }
  } catch (error) {
    console.error("Error fetching latest transfer details:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
