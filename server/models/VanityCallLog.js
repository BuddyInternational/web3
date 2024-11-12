import mongoose from "mongoose";

const VanityCallLogSchema = new mongoose.Schema({
  vanityAddress: {
    type: String,
    required: true,
    unique: true,
  },
  callCount: {
    type: Number,
    default: 1,
  },
});

const VanityCallLogData = mongoose.model('VanityCallLog', VanityCallLogSchema);
export { VanityCallLogData }
