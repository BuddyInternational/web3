import mongoose from "mongoose";

// Define the schema for sockatNFT
const UserContentSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
    },
    vanityAddress: {
      type: String,
      required: true,
    },
    contentDetails: [{
      mood: { type: String },
      content: {type: String}, 
      age: {type: Number}, 
      ipfsHash : {type: String},
      generateContentDate: { type: Date },
      contentWordCount: {type: Number},
      eligibleStatus: {type: Boolean},
      isSubbmited : {type: Boolean},
      submissionHash : {type: String},
      submissionDate : {type: Date}
    }],
  },
);

const UserContentData = mongoose.model("userContent", UserContentSchema);
export { UserContentData };