import dotenv from "dotenv";

dotenv.config();
export async function callLLM(prompt: string) {
    const { GoogleGenAI } = await import("@google/genai")
    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_KEY});
   
    const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
    console.log(`HF Response: ${JSON.stringify(res?.candidates?.[0]?.content)}` );
    return res?.candidates?.[0]?.content;
}
