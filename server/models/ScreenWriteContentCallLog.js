import mongoose from "mongoose";

const ScreenWriteContentCallLogSchema = new mongoose.Schema({
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

const ScreenWriteContentCallLogData = mongoose.model('ScreenWriteContentCallLog', ScreenWriteContentCallLogSchema);
export { ScreenWriteContentCallLogData }
