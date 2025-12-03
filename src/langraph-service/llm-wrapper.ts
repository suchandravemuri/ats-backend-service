import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
import { ChatGroq } from '@langchain/groq';
dotenv.config();
export const llm = new ChatGroq({
  model: "openai/gpt-oss-20b",
  temperature: 0,
  // other params...
});