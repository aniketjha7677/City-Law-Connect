import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getAIResponse } from "./ai.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const reply = await getAIResponse(messages);

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});