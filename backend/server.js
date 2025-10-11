import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import apiRouter from "./routes/index.js";
import { initDatabase } from "./config/database.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// Initialize SQLite DB and tables
await initDatabase();

// Routes
app.use("/api", apiRouter);

app.get("/", (req, res) => res.send("✅ JalSarathi Backend Running"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
