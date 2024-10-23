import mongoose from "mongoose";

const nftDetailSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
    },
    vanityAddress: {
      type: String,
      required: true,
    },
    nfts: [
      {
        contractAddress: { type: String },
        tokenId: { type: String },
        chainName: { type: String },
        name: { type: String },
        tokenType: { type: String },
        mediaType: {type: String},
        imageUrl: { type: String },
        priceCurrency: {type: String},
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
