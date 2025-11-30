import { callLLM } from "../llm.js";

export async function scoreNode(state: any) {
  const { jobDescription, candidates, candidateTexts } = state;
  const results = [];
  //console.log(`candidates are ${JSON.stringify(candidateTexts)} and js is ${jobDescription}`)
  for (const c of candidateTexts) {
    const prompt = `
    You are an HR expert please check jd and candidate resume and score them
Job Description:
${jobDescription}

Candidate Resume:
${c?.text}

Give ONLY a JSON:
{
  "id": "${c?.id}",
  "score": number (0-100)
}`;

    const output = await callLLM(prompt);
    let rawText = output?.parts?.[0].text;
    rawText = rawText ? rawText?.replace(/```json|```/g, "").trim() : "";
    const obj = JSON.parse(rawText);
    const op = { id: obj.id, score: obj.score };
    results.push(op);
  }

  return { ...state, scored: results };
}
