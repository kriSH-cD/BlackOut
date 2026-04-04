/**
 * api.js — Backend API Helper Functions
 * ──────────────────────────────────────
 * Handles all communication with the FastAPI backend.
 *
 * Uses the Fetch API to call:
 *   - POST /create  → Doctor creates a prescription
 *   - POST /verify  → Patient verifies an access code
 *   - POST /asr     → Audio speech recognition (Whisper AI)
 *
 * The backend URL is read from the environment variable
 * NEXT_PUBLIC_API_URL (set it in .env.local).
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Create a new prescription (called by the Doctor).
 */
export async function createPrescription(phone, medicines, reportText) {
  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: phone,
      medicines: medicines,
      reportText: reportText,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create prescription");
  }

  return response.json();
}

/**
 * Verify an access code and retrieve the prescription (called by the Patient).
 */
export async function verifyCode(phone, code) {
  const response = await fetch(`${API_URL}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: phone,
      code: code.toUpperCase(),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to verify code");
  }

  return response.json();
}

/**
 * Transcribe audio using the backend's Whisper ASR (Hugging Face).
 * 
 * @param {Blob} audioBlob - The recorded audio blob.
 * @returns {object} - { text: "transcribed text" }
 */
export async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.wav");

  const response = await fetch(`${API_URL}/asr`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Transcription failed");
  }

  return response.json();
}
