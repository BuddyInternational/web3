import mongoose from "mongoose";

const TotalCallCountSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
});

const TotalCallCountData = mongoose.model('TotalCallCount', TotalCallCountSchema);
export { TotalCallCountData }
