"use client";

import { useState } from "react";
import Link from "next/link";
import { verifyCode } from "../../lib/api";

export default function PatientPage() {
  // ── Form state ──────────────────────────────────────────────
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  // ── UI state ────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prescription, setPrescription] = useState(null);

  // ══════════════════════════════════════════════════════════════
  //  VERIFY CODE
  // ══════════════════════════════════════════════════════════════

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrescription(null);

    // Basic validation
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number (at least 10 digits).");
      setLoading(false);
      return;
    }

    if (!code || code.length !== 6) {
      setError("Please enter the 6-character access code.");
      setLoading(false);
      return;
    }

    try {
      const result = await verifyCode(phone, code);
      setPrescription(result.prescription);
    } catch (err) {
      setError(err.message || "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Format date ─────────────────────────────────────────────
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return dateStr;
    }
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
        <h1>🧑‍💼 Retrieve Prescription</h1>
        <p>Enter your phone number and the access code from your doctor.</p>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSubmit} id="verify-form">
          <div className="form-group">
            <label className="form-label" htmlFor="patient-phone">
              Your Phone Number
            </label>
            <input
              type="tel"
              id="patient-phone"
              className="form-input"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              maxLength={15}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="access-code">
              6-Digit Access Code
            </label>
            <input
              type="text"
              id="access-code"
              className="form-input code-input"
              placeholder="e.g. A1B2C3"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
              }
              maxLength={6}
              required
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            id="btn-verify"
          >
            {loading ? (
              <>
                <span className="spinner"></span> Verifying...
              </>
            ) : (
              "🔓 Retrieve Prescription"
            )}
          </button>
        </form>

        {/* ── ERROR ──────────────────────────────────────────── */}
        {error && (
          <div className="status-message status-error" id="status-error">
            ⚠️ {error}
          </div>
        )}

        {/* ── PRESCRIPTION RESULT ────────────────────────────── */}
        {prescription && (
          <div className="prescription-result" id="prescription-result">
            <h3>✅ Prescription Found</h3>

            <div className="prescription-field">
              <div className="field-label">Phone</div>
              <div className="field-value">{prescription.phone}</div>
            </div>

            <div className="prescription-field">
              <div className="field-label">Medicines</div>
              <div className="field-value prescription-medicines">
                {prescription.medicines}
              </div>
            </div>

            <div className="prescription-field">
              <div className="field-label">Doctor's Notes</div>
              <div className="field-value">{prescription.report_text}</div>
            </div>

            <div className="prescription-field">
              <div className="field-label">Prescribed On</div>
              <div className="field-value">
                {formatDate(prescription.created_at)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
