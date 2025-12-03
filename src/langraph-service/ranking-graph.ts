import { StateGraph, START, END } from "@langchain/langgraph";
import * as z from "zod";
import { fetchTextNode } from "./nodes/fetch_text.js";
import { scoreNode } from "./nodes/score_node.js";
import { reasonNode } from "./nodes/rank_node.js";
import {scoreReasoning} from "./nodes/score-reasoning.js"
import {ToolNode, toolsCondition} from  "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";

function shouldContinue(state: any) {
  const lastMessage = state.messages.slice(-1)[0];
  const hasToolCalls = 
    lastMessage.tool_calls && 
    Array.isArray(lastMessage.tool_calls) && 
    lastMessage.tool_calls.length > 0;

  if (hasToolCalls) {
    return "tools";
  }
  
  return END;
}

const score = tool(
  scoreNode,
  {
    name: "score",
    description: "Score candidates according to resume and JD.",
    schema: z.object({
      jobDescription: z.string(),
      candidateTexts: z.array(
        z.object({
          id: z.string(),
          text: z.string(),
        })
      )
    })
  }
);
;

const rank = tool(
  reasonNode,
  {
    name: "rank",
    description: "Rank candidates and generate reasoning.",
    schema: z.object({
      jobDescription: z.string(),
      scored: z.array(
        z.object({
          id: z.string(),
          score: z.number(),
        })
      ),
      candidateTexts: z.array(
        z.object({
          id: z.string(),
          text: z.string(),
        })
      )
    })
  }
);

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
  messages: z.array(z.any()).optional().default([]),
});

// Pass Zod schema DIRECTLY to StateGraph
const graph = new StateGraph({
  state: RankingState,
})

  .addNode("fetchText", fetchTextNode)
  .addNode("scoreReasoning", scoreReasoning)
  .addNode("tools",new ToolNode([score, rank]))
  .addEdge(START, "fetchText")
  .addEdge("fetchText", "scoreReasoning")
  .addConditionalEdges(
    "scoreReasoning",
    shouldContinue,
    {
      tools: "tools",
      [END]: END, 
    }
  )
  .addEdge("tools", "scoreReasoning")


export const runnable = graph.compile();