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
    // Call the Groq API (uses OpenAI-compatible format)
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        // Use a fast, lightweight model
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are a medical prescription formatter. Given raw text from a doctor, extract and format:
1. MEDICINES: List each medicine with dosage and frequency, one per line
2. NOTES: Any additional instructions or patient reports/notes

Respond in this exact format:
MEDICINES:
- Medicine name, dosage, frequency
- Medicine name, dosage, frequency

NOTES:
Doctor's notes, reports and instructions here

Keep it concise and professional.`,
          },
          {
            role: "user",
            content: rawText,
          },
        ],
        temperature: 0.1, // Even lower for more consistent extraction
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error("Groq API request failed");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse the AI response into medicines and notes
    return parseAIResponse(aiResponse);
  } catch (error) {
    console.error("Groq API error:", error);
    // Fall back to placeholder if API call fails
    return placeholderFormatter(rawText);
  }
}

/**
 * Parse the AI response text into { medicines, notes }.
 * Looks for "MEDICINES:" and "NOTES:" sections.
 */
function parseAIResponse(text) {
  let medicines = "";
  let notes = "";

  // Split by "NOTES:" to get two parts
  const parts = text.split(/NOTES:/i);

  if (parts.length >= 2) {
    // Extract the medicines section (remove the "MEDICINES:" header)
    medicines = parts[0].replace(/MEDICINES:/i, "").trim();
    notes = parts[1].trim();
  } else {
    // If format doesn't match, use the whole text as medicines
    medicines = text.trim();
    notes = "No additional notes";
  }

  return { medicines, notes };
}

/**
 * Placeholder formatter — used when Groq API key is not configured.
 * Does basic text cleanup without AI.
 *
 * @param {string} rawText - Raw input text
 * @returns {object} - { medicines, notes }
 */
function placeholderFormatter(rawText) {
  // Simple split: treat each line/sentence as a medicine entry
  const lines = rawText
    .split(/[.\n]/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return {
    medicines: lines.map((line) => `• ${line}`).join("\n"),
    notes: "Processed without AI — review and adjust as needed",
  };
}
