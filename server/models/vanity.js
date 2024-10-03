import mongoose from "mongoose";

const vanitySchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  vanityAddress: {
    type: String,
    required:true,
    unique: true,
  },
  vanityPrivateKey: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  }
});

const VanityData = mongoose.model('vanitydata', vanitySchema);
export { VanityData }; 
