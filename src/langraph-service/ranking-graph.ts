import { StateGraph, START, END } from "@langchain/langgraph";
import * as z from "zod";
import { fetchTextNode } from "./nodes/fetch_text.js";
import { scoreNode } from "./nodes/score_node.js";
import { reasonNode } from "./nodes/rank_node.js";

// Define state schema with Zod
const RankingState = z.object({
  jobId: z.string(),
  jobDescription: z.string().optional().default(""),
  candidates: z.array(z.any()).optional().default([]),
  candidateTexts: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      resumeUrl: z.string(),
      text: z.string(),
    })
  ).optional().default([]),
  scored: z.array(z.any()).optional().default([]),
  reasoned: z.array(z.any()).optional().default([]),
  ranked: z.array(z.any()).optional().default([]),
});

// Pass Zod schema DIRECTLY to StateGraph
const graph = new StateGraph(RankingState)
  .addNode("fetchText", fetchTextNode)
  .addNode("score", scoreNode)
  .addNode("reasoning", reasonNode)
  .addEdge(START, "fetchText")
  .addEdge("fetchText", "score")
  .addEdge("score", "reasoning")
  .addEdge("reasoning", END);

export const runnable = graph.compile();