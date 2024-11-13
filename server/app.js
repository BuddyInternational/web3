import express from "express";
import connection from "./config/config.js";
import { vanityRoutes } from "./routes/vanityRoutes.js";
import { nftRoutes } from "./routes/nftRoutes.js";
import { socketNFTRoutes } from "./routes/socketNFTRoutes.js";
import { userContentRoutes } from "./routes/userContentRoutes.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import axios from "axios";


const app = express();
const PORT = process.env.PORT || 8080;
// Middleware to parse JSON bodies
app.use(express.json());

// Apply CORS middleware with the configured options
app.use(cors());


// // Define CORS options
// const corsOptions = {
//   origin: ["http://localhost:3000", "https://downloads.gully.app/e4x6J2 "], // Allowed domains
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
//   allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
//   optionsSuccessStatus: 200,
// };

// // Apply CORS middleware
// app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Adjust to your frontend's origin
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// app.use(cors());
// const corsOptions = {
//   origin: 'http://localhost:3000', // replace with your frontend domain
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

// Routes
app.use("/api/vanity", vanityRoutes);
app.use("/api/nft/", nftRoutes);
app.use("/api/socket-nft/", socketNFTRoutes);
app.use("/api/user-content/", userContentRoutes);

app.post("/proxy", async (req, res) => {
  try {
    // Make the actual request to downloads.gully.app
    const response = await axios.post(process.env.TRACK_DOWNLOAD, req.body);

    // Forward the response from downloads.gully.app to the frontend
    res.json(response.data);
  } catch (error) {
    console.error("Proxy request failed:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get('/api/resolve-url', async (req, res) => {
  const { shortUrl } = req.query;
  if (!shortUrl) {
    return res.status(400).json({ message: 'Short URL is required' });
  }
  
  try {
    const response = await fetch(shortUrl, { method: 'HEAD', redirect: 'follow' });
    res.json({ resolvedUrl: response.url });
  } catch (error) {
    res.status(500).json({ message: 'Error resolving URL' });
  }
});

app.get("/api/ping", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running successfully."
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
