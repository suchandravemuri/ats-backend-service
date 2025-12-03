import { callLLM } from "../llm.js";

export async function reasonNode(state: any) {
  try {
    const { jobDescription, candidates, scored, candidateTexts } = state;

    // Build candidate blocks to provide to the LLM
    const candidatesBlock = scored
      .map((s: any) => {
        const cand = candidateTexts.find((c: any) => c.id === s.id);
        return `
  ID: ${s.id}
  Resume:
  ${cand ? cand.text : "<missing resume>"}
  Score:${s.score}
  `;
      })
      .join("\n-----------------\n");


    const prompt = `
  You are an HR domain expert specializing in job-candidate evaluation, ranking, and competency mapping.
  
  Your task:
  1. Read the Job Description.
  2. Read all Candidate Resumes.
  3. Rank ALL candidates relative to others (rank lies between 1-total number of candidates).
  4. Ranking rules:
     - Rank 1 = Best match.
     - No ties allowed.
     - Ranking must be based on skills, experience, relevance, and job fit.
  
  5. For each candidate, generate:
     - "rank" → Position relative to all other candidates (1 = best).
     - "reason" → 3–5 line explanation focusing on comparative strengths & weaknesses.
  
  Input:
  
  Job Description:
  ${jobDescription}
  
  Candidates:
  ${candidatesBlock}
  
  Output format:
  Return ONLY a JSON array. No markdown. No backticks.
  
  [
    {
      "id": "candidate-id",
      "score": number,
      "rank": number,
      "reason": "3–5 line explanation"
    }
  ]
  
  Constraints:
  - No invented experience or skills.
  - Reasons MUST be comparative (e.g., "stronger than others in X", "weaker in Y compared to top-ranked candidates").
  - The number of items in the JSON array must equal the number of candidates.
  `;

    const output = await callLLM(prompt);
    console.log(` output for the rank node is ${JSON.stringify(output?.parts?.[0].text)}`)
    return { ...state, ranked: JSON.parse((output?.parts?.[0]?.text ?? "")) };
  }
  catch (err) {
    console.log("reasonNode ERROR:", err);
    throw err;
  }

}
