import express from "express";
import connection from "./config/config.js";
import { vanityRoutes } from "./routes/vanityRoutes.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/vanity", vanityRoutes);

app.get("/api/ping", (req, res)=> {
  res.status(200).json({
    success: true,
    message: "Server running successfully."
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
