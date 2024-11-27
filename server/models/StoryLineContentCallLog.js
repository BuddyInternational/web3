import mongoose from "mongoose";

const StoryLineContentCallLogSchema = new mongoose.Schema({
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

const StoryLineContentCallLogData = mongoose.model('StoryLineContentCallLog', StoryLineContentCallLogSchema);
export { StoryLineContentCallLogData }
