import mongoose from "mongoose";

// Define the schema for StoryLines
const StoryLineContentSchema = new mongoose.Schema(
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
      submissionDate : {type: Date},
      chainId : {type:Number,default: null},
    }],
  },
);

const StoryLineContentData = mongoose.model("storyLines", StoryLineContentSchema);
export { StoryLineContentData };