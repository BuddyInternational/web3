import mongoose from "mongoose";

const UserContentCallLogSchema = new mongoose.Schema({
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

const UserContentCallLogData = mongoose.model('UserContentCallLog', UserContentCallLogSchema);
export { UserContentCallLogData }
