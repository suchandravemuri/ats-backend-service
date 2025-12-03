import { callLLM } from "../llm.js";

export async function scoreNode(state: any) {
  try {
    console.log(`score node called`);
    const { jobDescription, candidates, candidateTexts } = state;
    const results = state?.scored ?? [];
    for (const c of candidateTexts) {
      const prompt = `You are an HR domain expert specializing in recruitment, competency mapping, and job-candidate matching.

    Evaluate the following:
    
    Job Description:
    ${jobDescription}
    
    Candidate Resume:
    ${c?.text}
    
    Instructions:
    1. Carefully compare the candidate's resume with the job description.
    2. Evaluate alignment across the following areas:
       - Required skills
       - Preferred skills
       - Years of experience
       - Relevant projects
       - Domain knowledge
       - Tools/technologies mentioned
       - Soft skills (only if explicitly present)
       - Overall job fit
    3. Score strictly between 0–100.
       - 0 = No match
       - 100 = Perfect match
    4. Do NOT generate any explanation, summary, description, or bullet points.
    5. Do NOT include extra fields.
    
    Return ONLY a valid JSON object in this format:
    
    {
      "id": "${c?.id}",
      "score": number
    }
    `;

      const output = await callLLM(prompt);
      console.log(`score node op for candidate with id ${c.id} and jd ${jobDescription} is ${JSON.stringify(output)}`);
      let rawText = output?.parts?.[0].text;
      rawText = rawText ? rawText?.replace(/```json|```/g, "").trim() : "";
      const obj = JSON.parse(rawText);
      const op = { id: obj.id, score: obj.score };
      results.push(op);
    }

    return { ...state, scored: results };
  } catch (err) {
    console.log("scoreNode ERROR:", err);
    throw err; 
  }

}
