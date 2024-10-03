import express from "express";
import VanityEth from "./libs/VanityEth.js";
import bodyParser from "body-parser";
import connection from "./config/config.js";
import { vanityRoutes } from "./routes/vanityRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(bodyParser.json());


// Routes
app.use("/api/vanity", vanityRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
