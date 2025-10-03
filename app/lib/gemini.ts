import { GoogleGenAI } from "@google/genai";
import { prepareInstructions } from "../../constants";

export interface GeminiArgs {
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  model?: string;
}

function extractJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    // try to find the first {...} block
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {}
    }
    throw new Error("Gemini did not return valid JSON");
  }
}

export async function generateFeedbackWithGemini({
  jobTitle,
  jobDescription,
  resumeText,
  model = "gemini-2.5-flash",
}: GeminiArgs) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY");

  console.log("Initializing Gemini API (genai)...");
  const ai = new GoogleGenAI({ apiKey });

  const instructions = prepareInstructions({ jobTitle, jobDescription });
  const prompt = `${instructions}\n\nHere is the resume plain text between <resume> tags.\n<resume>\n${resumeText}\n</resume>`;

  console.log("Sending request to Gemini...");
  console.log("Resume text length:", resumeText.length);

  try {
    // Try preferred model
    const res = await ai.models.generateContent({ model, contents: prompt });
    const text = (res as any)?.text ?? "";
    if (!text) {
      console.warn(
        "Primary model returned empty text; falling back to candidates parsing."
      );
      const cand =
        (res as any)?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (cand) {
        console.log("Parsed text from candidates; length:", cand.length);
        return extractJson(cand);
      }
    }
    console.log(
      "Gemini response received (primary), length:",
      String(text).length
    );
    return extractJson(String(text));
  } catch (primaryErr) {
    console.warn(
      "Primary model failed, attempting fallback to gemini-1.5-flash:",
      primaryErr
    );
    try {
      const fallbackModel = "gemini-1.5-flash";
      const res = await ai.models.generateContent({
        model: fallbackModel,
        contents: prompt,
      });
      const text = (res as any)?.text ?? "";
      if (!text) {
        const cand =
          (res as any)?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        if (cand) {
          console.log(
            "Parsed text from candidates (fallback); length:",
            cand.length
          );
          return extractJson(cand);
        }
      }
      console.log(
        "Gemini response received (fallback), length:",
        String(text).length
      );
      return extractJson(String(text));
    } catch (fallbackErr) {
      console.error("Gemini API error (fallback failed):", fallbackErr);
      throw new Error(
        `AI analysis failed: ${fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr)}`
      );
    }
  }
}
