import mongoose from "mongoose";

// Define the schema for sockatNFT
const sockatNftSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
    },
    vanityAddress: {
      type: String,
      required: true,
    },
    lastTransferDetails: {
      nftAddress: { type: String },
      name: {type: String},
      chainName: { type: String },
      mediaType: {type: String},
      imageUrl: { type: String },
      tokenId: { type: String },  
      transferDate: { type: Date },
    },
  },
);

const SocketNFTData = mongoose.model("socketnftdetails", sockatNftSchema);
export { SocketNFTData };