import express from "express";
import connection from "./config/config.js";
import { vanityRoutes } from "./routes/vanityRoutes.js";
import { nftRoutes } from "./routes/nftRoutes.js";
import { socketNFTRoutes } from "./routes/socketNFTRoutes.js";
import { userContentRoutes } from "./routes/userContentRoutes.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

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

// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
// const corsOptions = {
//   origin: 'http://localhost:3000', // replace with your frontend domain
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://gully.buddy.international");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// Routes
app.use("/api/vanity", vanityRoutes);
app.use("/api/nft/", nftRoutes);
app.use("/api/socket-nft/", socketNFTRoutes);
app.use("/api/user-content/", userContentRoutes);

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
