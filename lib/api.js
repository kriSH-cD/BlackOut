/**
 * api.js — Backend API Helper Functions
 * ──────────────────────────────────────
 * Handles all communication with the FastAPI backend.
 *
 * Uses the Fetch API to call:
 *   - POST /create  → Doctor creates a prescription
 *   - POST /verify  → Patient verifies an access code
 *
 * The backend URL is read from the environment variable
 * NEXT_PUBLIC_API_URL (set it in .env.local).
 */

// Read the backend URL from environment variables
// Falls back to localhost:8000 if not set
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Create a new prescription (called by the Doctor).
 *
 * @param {string} phone      - Patient's phone number (10–15 digits)
 * @param {string} medicines  - Comma-separated medicine list
 * @param {string} reportText - Doctor's notes / diagnosis
 * @returns {object} - { message, access_code, expires_in_minutes }
 */
export async function createPrescription(phone, medicines, reportText) {
  // Make a POST request to the backend /create endpoint
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

  // If the response is not OK (e.g. 400, 500), throw an error
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create prescription");
  }

  // Parse and return the JSON response
  return response.json();
}

/**
 * Verify an access code and retrieve the prescription (called by the Patient).
 *
 * @param {string} phone - Patient's phone number
 * @param {string} code  - 6-character access code
 * @returns {object} - { message, prescription: { id, phone, medicines, report_text, created_at } }
 */
export async function verifyCode(phone, code) {
  // Make a POST request to the backend /verify endpoint
  const response = await fetch(`${API_URL}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: phone,
      code: code.toUpperCase(), // Always send uppercase
    }),
  });

  // If the response is not OK, throw an error with the detail message
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to verify code");
  }

  // Parse and return the JSON response
  return response.json();
}
