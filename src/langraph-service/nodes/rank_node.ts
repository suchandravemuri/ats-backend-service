import { callLLM } from "../llm.js";

export async function reasonNode(state: any) {
  const { jobDescription, candidates, scored,  candidateTexts} = state;
  const results = [];

  for (const s of scored) {
    const cand = candidateTexts.find((c: any) => c.id === s.id);


    const prompt = `
Job Description:
${jobDescription}

Candidate Resume:
${cand.text}

Given Score: ${s.score}

Explain the reasoning for this match in 4–6 lines.
Return JSON {"id":"${s.id}","reason":"text"}.
`;
    // console.log(prompt)
    const output = await callLLM(prompt);
    //results.push(JSON.parse(output));
  }

 // return { ...state, reasoned: results };
}
