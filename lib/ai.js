import { HfInference } from "@huggingface/inference";

/**
 * ai.js — Hugging Face Llama 3 Integration
 * ──────────────────────────────
 * Sends raw prescription text to the Hugging Face Free Inference API
 * using Llama 3.1 8B Instruct, returning a structured format (medicines + notes).
 *
 * Setup:
 *   1. Create a HF Token at https://huggingface.co/settings/tokens
 *   2. Add it to .env.local:
 *      NEXT_PUBLIC_HF_TOKEN=hf_your_key_here
 */

// Read the HF Token from environment variables
const HF_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN;

// Initialize the HF Inference client
const hf = new HfInference(HF_TOKEN);

/**
 * Process raw prescription text via HF Inference.
 */
export async function processWithAI(rawText) {
  // If no API key is set, use the placeholder formatter
  if (!HF_TOKEN) {
    console.warn("⚠️ Hugging Face API key not configured. Using placeholder formatter.");
    return placeholderFormatter(rawText);
  }

  try {
    const response = await hf.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "system",
          content: `You are a clinical assistant AI.

Convert the following unstructured medical input into a STRICT JSON format that matches a prescription dashboard.

⚠️ RULES:
- Output ONLY valid JSON (no explanation, no markdown, no text outside JSON)
- Do NOT add extra fields
- If data is missing, use empty string "" or empty array []
- Keep responses concise and medically relevant

🎯 JSON STRUCTURE:

{
  "clinical_presentation": {
    "symptoms": "",
    "primary_diagnosis": ""
  },
  "pharmacological_treatment": [
    {
      "medicine_name": "",
      "frequency": "",
      "duration": "",
      "instructions": ""
    }
  ],
  "recommended_tests": [],
  "lifestyle_advice": ""
}`
        },
        {
          role: "user",
          content: rawText,
        },
      ],
      temperature: 0.1,
      max_tokens: 1000
    });

    let content = response.choices[0].message.content;
    
    // Sometimes HF models return markdown code blocks e.g. ```json ... ```
    if (content.includes("```json")) {
      content = content.replace(/```json/g, "").replace(/```/g, "").trim();
    } else if (content.includes("```")) {
      content = content.replace(/```/g, "").trim();
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error("HF Inference API error:", error);
    return placeholderFormatter(rawText);
  }
}

/**
 * Placeholder formatter — used when HF API key is not configured or fails.
 */
function placeholderFormatter(rawText) {
  return {
    clinical_presentation: {
      symptoms: rawText.substring(0, 100),
      primary_diagnosis: "Clinical evaluation required."
    },
    pharmacological_treatment: [
      { medicine_name: "Review Transcription", frequency: "-", duration: "-", instructions: "Confirm details before save" }
    ],
    recommended_tests: [],
    lifestyle_advice: "Monitor symptoms daily."
  };
}
