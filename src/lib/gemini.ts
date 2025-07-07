import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function askGemini(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash", // ✅ correct model
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Respond only in English. In 3-4 lines, respond concisely suitable for voice output: ${prompt}`,
            },
          ],
        },
      ],
    });

    const response = await result.response;
    const text = response.text();
    return text;
  } catch (err) {
    console.error("❌ Gemini error:", err);
    return "Sorry, Gemini failed to respond.";
  }
}
