/**
 * groq.js — Groq AI Integration
 * ──────────────────────────────
 * Sends raw prescription text to the Groq API and returns
 * a structured format (medicines + notes).
 *
 * If no API key is configured, falls back to a simple
 * placeholder formatter so the app still works.
 *
 * Setup:
 *   1. Go to https://console.groq.com/keys
 *   2. Create a free API key
 *   3. Add it to .env.local:
 *      NEXT_PUBLIC_GROQ_API_KEY=gsk_your_key_here
 */

// Read the Groq API key from environment variables
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

// Groq API endpoint
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Process raw prescription text with Groq AI.
 * Returns a structured object: { medicines, notes }
 *
 * @param {string} rawText - The raw text from the doctor (typed or spoken)
 * @returns {object} - { medicines: string, notes: string }
 *
 * Example usage:
 *   const result = await processWithGroq("Give paracetamol 500mg twice daily and rest for 2 days");
 *   // result.medicines → "Paracetamol 500mg - Twice daily"
 *   // result.notes → "Rest for 2 days"
 */
export async function processWithGroq(rawText) {
  // If no API key is set, use the placeholder formatter
  if (!GROQ_API_KEY) {
    console.warn("⚠️ Groq API key not configured. Using placeholder formatter.");
    return placeholderFormatter(rawText);
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are a medical prescription formatter. Given raw text from a doctor, extract structured clinical data.

Respond in this exact JSON format:
{
  "patient": {
    "name": "",
    "age": "",
    "gender": "Male",
    "phone": ""
  },
  "symptoms": "",
  "diagnosis": "",
  "medicines": [
    { "name": "", "dosage": "", "frequency": "", "duration": "", "instructions": "" }
  ],
  "tests": [],
  "advice": "",
  "followUp": {
    "date": "",
    "instructions": ""
  }
}

Keep it concise, clinical, and high-precision.`,
          },
          {
            role: "user",
            content: rawText,
          },
        ],
        temperature: 0.1,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error("Groq API request failed");
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("Groq API error:", error);
    return placeholderFormatter(rawText);
  }
}

/**
 * Placeholder formatter — used when Groq API key is not configured or fails.
 */
function placeholderFormatter(rawText) {
  return {
    patient: {
      name: "",
      age: "",
      gender: "Male"
    },
    symptoms: rawText.substring(0, 100),
    diagnosis: "Clinical evaluation required.",
    medicines: [
      { name: "Review Transcription", dosage: "-", frequency: "-", duration: "-", instructions: "Confirm details before save" }
    ],
    tests: [],
    advice: "Monitor symptoms daily.",
    followUp: {
      date: "",
      instructions: "Return if condition persists."
    }
  };
}
