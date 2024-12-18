import mongoose from "mongoose";

// Define the schema for ScreenWrite
const ScreenWriteContentSchema = new mongoose.Schema(
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
      place: {type: String},
      relativeTag: {type: String}, 
      ipfsHash : {type: String},
      generateContentDate: { type: Date },
      contentWordCount: {type: Number},
      eligibleStatus: {type: Boolean},
      isSubbmited : {type: Boolean},
      submissionHash : {type: String},
      submissionDate : {type: Date},
      chainId : {type:Number,default: null},
    }],
  },
);

const ScreenWriteContentData = mongoose.model("screenWrite", ScreenWriteContentSchema);
export { ScreenWriteContentData };