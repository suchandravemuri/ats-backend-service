import { scoreNode } from "./score_node";
import { reasonNode } from "./rank_node";
import { llm } from "../llm-wrapper"
import { tool } from "@langchain/core/tools";
import { SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
const MAX_TOOL_TEXT = 500;
function safeText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, " ")
    .replace(/\r/g, " ")
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



// Reactive LLM agent instruction

export async function scoreReasoning(state: any) {

  const llmWithTools = llm.bindTools([score, rank], {
    configurable: { state }
  });
  const safeCandidates = state.candidateTexts.map((c: any) => ({
    id: c.id,
    text: safeText(c.text).slice(0, MAX_TOOL_TEXT)
  }));
  console.log("aiMsg")
  try {
    let prompt = `
      You are an HR evaluation system.
      
      Given:
      - A job description
      - Candidate resumes
      
      Your goal is:
      - Evaluate each candidate
      - Decide their suitability
      - Produce a ranking with reasoning
      
      You may use the available tools when needed:
      - "score": evaluate each candidate
      - "rank": generate rankings & reasoning
      
      Think step-by-step and choose the correct tool.
      Never produce the final result yourself — use tools instead.
      
      Job Description:
      ${state.jobDescription}
      
      Candidates:
      ${state.candidateTexts.map((c: any) => `ID: ${c.id}, Text: ${safeText(c.text)}`).join("\n")}
      `
    
    const aiMsg = await llmWithTools.invoke(prompt);
    //console.log(`the main ai message is ${JSON.stringify(aiMsg)}`);
    return {
      ...state,
      messages: [...state.messages, aiMsg],
    };
  }
  catch (err) {
    console.log(`the error is ${JSON.stringify(err)}`)
  }

};
