import mongoose from "mongoose";

const vanitySchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  vanityDetails: [
    {
      vanityAddress: { type: String, required: true },
      vanityPrivateKey: { type: String, required: true },
      vanityAccountType: { type: String, required: true },
    },
  ],
  createdAt: {
    type: Date,
  },
  Role:{
    type:String,
  }
});

const VanityData = mongoose.model('vanitydata', vanitySchema);
export { VanityData }; 
