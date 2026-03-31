"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { createPrescription } from "../../lib/api";
import { processWithGroq } from "../../lib/groq";

export default function DoctorPage() {
  // ── Form state ──────────────────────────────────────────────
  const [phone, setPhone] = useState("");
  const [medicines, setMedicines] = useState("");
  const [reportText, setReportText] = useState("");

  // ── UI state ────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [accessCode, setAccessCode] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ── Voice recording state ───────────────────────────────────
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const recognitionRef = useRef(null);

  // ── Chat messages state ─────────────────────────────────────
  const [chatMessages, setChatMessages] = useState([
    { role: "bot", text: "Hello, Doctor! Describe the prescription or use voice input. I'll format it for you." },
  ]);
  const [chatInput, setChatInput] = useState("");

  // ══════════════════════════════════════════════════════════════
  //  VOICE INPUT (Web Speech API)
  // ══════════════════════════════════════════════════════════════

  const startListening = useCallback(() => {
    // Check browser support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    let fullTranscript = "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          fullTranscript += transcript + " ";
        } else {
          interim = transcript;
        }
      }
      setVoiceText(fullTranscript + interim);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error !== "aborted") {
        setError(`Voice error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
    setError("");
    setVoiceText("");
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // ══════════════════════════════════════════════════════════════
  //  AI PROCESSING (Groq)
  // ══════════════════════════════════════════════════════════════

  const handleAIProcess = async (text) => {
    if (!text.trim()) {
      setError("No text to process. Speak or type something first.");
      return;
    }

    setAiLoading(true);
    setError("");

    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: text },
      { role: "bot", text: "🔄 Analyzing with AI..." },
    ]);

    try {
      const result = await processWithGroq(text);

      // Auto-fill the form fields
      setMedicines(result.medicines);
      setReportText(result.notes);

      setChatMessages((prev) => [
        ...prev.slice(0, -1), // Remove "Analyzing..." message
        {
          role: "bot",
          text: `✅ Done! I've extracted the medicines and notes. Review the form below and submit when ready.`,
        },
      ]);
    } catch (err) {
      setError("AI processing failed. Please fill in manually.");
      setChatMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", text: `❌ Error: ${err.message}. Try again or fill manually.` },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // Process voice text with AI
  const handleProcessVoice = () => {
    handleAIProcess(voiceText);
  };

  // Process chat input with AI
  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    handleAIProcess(chatInput);
    setChatInput("");
  };

  // ══════════════════════════════════════════════════════════════
  //  SUBMIT PRESCRIPTION
  // ══════════════════════════════════════════════════════════════

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    setAccessCode(null);

    // Basic validation
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number (at least 10 digits).");
      setLoading(false);
      return;
    }

    if (!medicines.trim()) {
      setError("Please enter the medicines.");
      setLoading(false);
      return;
    }

    if (!reportText.trim()) {
      setError("Please enter the report / notes.");
      setLoading(false);
      return;
    }

    try {
      const result = await createPrescription(phone, medicines, reportText);
      setAccessCode(result.access_code);
      setExpiresIn(result.expires_in_minutes);
      setSuccessMsg(result.message);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ── Reset form ──────────────────────────────────────────────
  const handleReset = () => {
    setPhone("");
    setMedicines("");
    setReportText("");
    setAccessCode(null);
    setExpiresIn(null);
    setError("");
    setSuccessMsg("");
    setVoiceText("");
    setChatMessages([
      { role: "bot", text: "Ready for the next prescription. Go ahead!" },
    ]);
  };

  // ══════════════════════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════════════════════

  return (
    <div className="page-container">
      <Link href="/" className="back-link" id="back-home">
        ← Back to Home
      </Link>

      <div className="page-header">
        <h1>👨‍⚕️ Create Prescription</h1>
        <p>Use text, voice, or AI to fill in the prescription details.</p>
      </div>

      <div className="glass-card">
        {/* ── AI ASSISTANT SECTION ──────────────────────────── */}
        <div className="chat-container" style={{ marginTop: 0, borderTop: "none", paddingTop: 0, marginBottom: "1.5rem" }}>
          <div className="chat-title">🤖 AI Assistant</div>

          <div className="chat-messages" id="chat-messages">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                {msg.role === "bot" ? "🤖 " : "🧑‍⚕️ "}
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input-row">
            <input
              type="text"
              className="form-input"
              placeholder="Describe the prescription..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
              disabled={aiLoading}
              id="chat-input"
            />
            <button
              className="btn btn-ai"
              onClick={handleChatSend}
              disabled={aiLoading || !chatInput.trim()}
              id="btn-chat-send"
            >
              {aiLoading ? <span className="spinner"></span> : "Ask AI"}
            </button>
          </div>
        </div>

        {/* ── VOICE INPUT SECTION ───────────────────────────── */}
        <div className="btn-row">
          <button
            className={`btn btn-voice ${isListening ? "listening" : ""}`}
            onClick={isListening ? stopListening : startListening}
            disabled={aiLoading}
            id="btn-voice"
          >
            {isListening ? "⏹ Stop Recording" : "🎙 Voice Input"}
          </button>

          {voiceText && (
            <button
              className="btn btn-ai"
              onClick={handleProcessVoice}
              disabled={aiLoading}
              id="btn-process-voice"
            >
              {aiLoading ? <span className="spinner"></span> : "✨ Process with AI"}
            </button>
          )}
        </div>

        {/* Voice transcript preview */}
        {voiceText && (
          <div className="voice-preview">
            <div className="form-label">🎙 Voice Transcript</div>
            <div className="voice-text">{voiceText}</div>
          </div>
        )}

        {/* ── PRESCRIPTION FORM ─────────────────────────────── */}
        <form onSubmit={handleSubmit} id="prescription-form">
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Patient Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              className="form-input"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              maxLength={15}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="medicines">
              Medicines
            </label>
            <textarea
              id="medicines"
              className="form-textarea"
              placeholder="e.g. Paracetamol 500mg — twice daily&#10;Amoxicillin 250mg — thrice daily"
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="report-text">
              Report / Notes
            </label>
            <textarea
              id="report-text"
              className="form-textarea"
              placeholder="e.g. Patient has mild fever and sore throat. Rest advised for 3 days."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              required
            />
          </div>

          {/* Submit / Reset buttons */}
          <div className="btn-row">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              id="btn-submit"
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Creating...
                </>
              ) : (
                "📋 Create Prescription"
              )}
            </button>
            {accessCode && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
                id="btn-reset"
              >
                + New
              </button>
            )}
          </div>
        </form>

        {/* ── STATUS MESSAGES ───────────────────────────────── */}
        {error && (
          <div className="status-message status-error" id="status-error">
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div className="status-message status-success" id="status-success">
            {successMsg}
          </div>
        )}

        {/* ── ACCESS CODE DISPLAY ───────────────────────────── */}
        {accessCode && (
          <div className="code-display" id="code-display">
            <div className="code-label">Patient Access Code</div>
            <div className="code-value">{accessCode}</div>
            <div className="code-expiry">
              ⏱ Expires in {expiresIn} minutes — share this with the patient
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
