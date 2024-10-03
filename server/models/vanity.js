const mongoose = require("mongoose");

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

const VanityModel = mongoose.model('vanityData', vanitySchema);
module.exports = {VanityModel};
