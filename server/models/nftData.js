import mongoose from "mongoose";

const nftDetailSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
    },
    vanityAddress: {
      type: String,
      required: true,
    },
    nfts: [
      {
        nftAddress: { type: String },
        tokenId: { type: String },
        chainName: { type: String },
        name: { type: String },
        tokenType: { type: String },
        imageUrl: { type: String },
        floorPrice: { type: Number },
        floorPriceUsd: { type: Number },
        lastclaimedAt: { type: Date },
        totalClaimedRewardCount: { type: Number },
        totalClaimedRewardHash: { type: [String] },
      },
    ],
  },
  { timestamps: true }
);

const NFTData = mongoose.model("nftdetails", nftDetailSchema);
export { NFTData };
  