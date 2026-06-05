import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Mount chat routes
app.use("/api/chat", chatRoutes);

// Basic root check
app.get("/", (req, res) => res.send("SmartChatbot backend running ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
