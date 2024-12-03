import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
  mobile: {
    type: String, 
    default: null,
  },
  email: {
    type: String, 
    default: null,
  },
  logInStatus:{
    type: Boolean,
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
    default: Date.now, 
  },
});

const RegisterData = mongoose.model('register', registerSchema);
export { RegisterData }; 
