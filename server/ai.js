import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,

  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "CityLawConnect",
    },
  },

  model: "meta-llama/llama-3-8b-instruct",
  temperature: 0.3,
});

export async function getAIResponse(messages) {
  try {
    const res = await model.invoke([
      {
        role: "system",
        content: "You are an Indian legal assistant.",
      },
      ...messages.slice(-6),
    ]);

    return res.content;

  } catch (err) {
    console.error("AI ERROR:", err);  // 🔥 IMPORTANT
    throw err;
  }
}