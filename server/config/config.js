import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connection = mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.log(err));

export default connection;