import { GoogleGenAI } from "@google/genai";
import { prepareInstructions } from "../../constants";

export interface GeminiArgs {
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  model?: string;
}

// Helper to ensure we get clean JSON even if the AI adds markdown text
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
  model = "gemini-2.5-flash", // 1. FORCE the newer model by default
}: GeminiArgs) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY");

  console.log("Initializing Gemini API (genai)...");
  const ai = new GoogleGenAI({ apiKey });

  const instructions = prepareInstructions({ jobTitle, jobDescription });
  
  // 2. SAFETY: Explicitly ask for JSON to prevent parsing errors
  const prompt = `${instructions}\n\nIMPORTANT: Return ONLY valid JSON. Do not use Markdown code blocks.\n\nHere is the resume plain text between <resume> tags.\n<resume>\n${resumeText}\n</resume>`;

  console.log("Sending request to Gemini...");
  console.log("Using Model:", model);
  console.log("Resume text length:", resumeText.length);

  try {
    // --- PRIMARY ATTEMPT (Gemini 2.5 Flash) ---
    const res = await ai.models.generateContent({ 
      model: model, 
      contents: prompt 
    });
    
    const text = (res as any)?.text ?? "";
    
    // Safety check: sometimes text is empty but 'candidates' has the data
    if (!text) {
      console.warn("Primary model returned empty text; falling back to candidates parsing.");
      const cand = (res as any)?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (cand) {
        console.log("Parsed text from candidates; length:", cand.length);
        return extractJson(cand);
      }
    }
    
    console.log("Gemini response received (primary), length:", String(text).length);
    return extractJson(String(text));

  } catch (primaryErr) {
    console.warn(
      `Primary model (${model}) failed, attempting fallback to gemini-flash-latest:`,
      primaryErr
    );

    try {
      // --- FALLBACK ATTEMPT (Gemini Flash Latest) ---
      // We switch to 'gemini-flash-latest' because 'gemini-1.5-flash' is restricted on your key.
      const fallbackModel = "gemini-flash-latest";
      
      const res = await ai.models.generateContent({
        model: fallbackModel,
        contents: prompt,
      });

      const text = (res as any)?.text ?? "";
      
      if (!text) {
        const cand = (res as any)?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        if (cand) {
          console.log("Parsed text from candidates (fallback); length:", cand.length);
          return extractJson(cand);
        }
      }

      console.log("Gemini response received (fallback), length:", String(text).length);
      return extractJson(String(text));

    } catch (fallbackErr) {
      console.error("Gemini API error (fallback failed):", fallbackErr);
      // Throw a clean error so the UI knows exactly what happened
      throw new Error(
        `AI analysis failed: ${fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr)}`
      );
    }
  }
}