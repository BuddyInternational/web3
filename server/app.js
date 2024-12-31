import express from "express";
import connection from "./config/config.js";
import { vanityRoutes } from "./routes/vanityRoutes.js";
import { userVanityRoutes } from "./routes/userRoutes.js";
import { nftRoutes } from "./routes/nftRoutes.js";
import { socketNFTRoutes } from "./routes/socketNFTRoutes.js";
import { userContentRoutes } from "./routes/userContentRoutes.js";
import { storyLineContentRoutes } from "./routes/storyLineContentRoutes.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import axios from "axios";
import { screenWriteContentRoutes } from "./routes/screenWriteContentRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080;
// Middleware to parse JSON bodies
app.use(express.json());

// Apply CORS middleware with the configured options
app.use(cors());

// Routes
app.use("/api/vanity", vanityRoutes);
app.use("/api/user-vanity", userVanityRoutes);
app.use("/api/nft/", nftRoutes);
app.use("/api/socket-nft/", socketNFTRoutes);
app.use("/api/user-content/", userContentRoutes);
app.use("/api/storyLine-content/", storyLineContentRoutes);
app.use("/api/screenWrite-content/", screenWriteContentRoutes);

// track download vanity data CSV using short link
app.post("/proxyVanityDataDownload", async (req, res) => {
  try {
    // Make the actual request to downloads.gully.app
    const response = await axios.post(
      process.env.TRACK_DOWNLOAD_VANITY_DATA,
      req.body
    );

    // Forward the response from downloads.gully.app to the frontend
    res.json(response.data);
  } catch (error) {
    console.error("proxyVanityDataDownload request failed:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Track download User Content CSV using short link
app.post("/proxyUserContentDownload", async (req, res) => {
  try {
    // Make the actual request to downloads.gully.app
    const response = await axios.post(
      process.env.TRACK_DOWNLOAD_USER_CONTENT_DATA,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error("proxyUserContentDownload request failed:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Track download Story Line Content CSV using short link
app.post("/proxyStoryLineContentDownload", async (req, res) => {
  try {
    // Make the actual request to downloads.gully.app
    const response = await axios.post(
      process.env.TRACK_DOWNLOAD_STORYLINE_CONTENT_DATA,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error("proxyStoryLineContentDownload request failed:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Track download Screen Write Content CSV using short link
app.post("/proxyScreenWriteContentDownload", async (req, res) => {
  try {
    // Make the actual request to downloads.gully.app
    const response = await axios.post(
      process.env.TRACK_DOWNLOAD_SCREENWRITE_CONTENT_DATA,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error("proxyScreenWriteContentDownload request failed:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/resolve-url", async (req, res) => {
  const { shortUrl } = req.query;
  if (!shortUrl) {
    return res.status(400).json({ message: "Short URL is required" });
  }

  try {
    const response = await fetch(shortUrl, {
      method: "HEAD",
      redirect: "follow",
    });
    res.json({ resolvedUrl: response.url });
  } catch (error) {
    res.status(500).json({ message: "Error resolving URL" });
  }
});

app.get("/api/ping", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running successfully.",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
