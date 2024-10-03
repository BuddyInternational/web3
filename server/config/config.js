const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.log(err));