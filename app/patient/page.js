"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { verifyCode } from "../../lib/api";

export default function PatientPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prescription, setPrescription] = useState(null);
  
  // AI Assistant State
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrescription(null);

    const canonicalPhone = phone.replace(/\D/g, "");
    if (canonicalPhone.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      setLoading(false);
      return;
    }

    if (!code || code.length !== 6) {
      setError("Please enter the 6-character access code.");
      setLoading(false);
      return;
    }

    try {
      const result = await verifyCode(canonicalPhone, code);
      setPrescription(result.prescription);
      // Clear AI context on new prescription
      setAiResponse("");
    } catch (err) {
      setError(err.message || "Invalid or expired code. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const parseReport = (reportText) => {
    if (!reportText) return {};
    const sections = {};
    const lines = reportText.split('\n');
    lines.forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length > 0) {
        sections[key.trim()] = rest.join(':').trim();
      }
    });
    return sections;
  };

  const parseMedicines = (medsString) => {
    if (!medsString) return [];
    return medsString.split(';').map(med => {
      const parts = med.trim().match(/^(.*?)\((.*?)\)$/);
      if (parts) {
        const [_, name, details] = parts;
        const [dosage, frequency, duration] = details.split(',').map(s => s.trim());
        return { name, dosage, frequency, duration };
      }
      return { name: med.trim(), dosage: '-', frequency: '-', duration: '-' };
    });
  };

  const handleAiAsk = async (e) => {
    if (e) e.preventDefault();
    if (!aiQuery.trim() || !prescription) return;

    setIsAiLoading(true);
    setAiResponse("");

    try {
      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `You are a helpful medical assistant for a patient. You only answer questions based ONLY on the following clinical prescription data. Do not provide general medical advice outside this context. 
              
              PRESCRIPTION CONTEXT:
              Meds: ${prescription.medicines}
              Report: ${prescription.report_text}
              
              Keep your answer concise (max 2-3 sentences), reassuring, and strictly based on the provided text. If the answer is not in the text, advise them to contact their doctor.`,
            },
            { role: "user", content: aiQuery },
          ],
          temperature: 0.3,
          max_tokens: 200,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setAiResponse(data.choices[0].message.content);
      } else {
        setAiResponse("I'm sorry, I'm having trouble connecting to the medical engine. Please review your prescription manually.");
      }
    } catch (err) {
      setAiResponse("Connectivity issue. Please contact support or your clinician.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const report = prescription ? parseReport(prescription.report_text) : {};
  const meds = prescription ? parseMedicines(prescription.medicines) : [];

  return (
    <div className="pt-bg">
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header Branding */}
        <header style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '2.5rem', fontWeight: 900, color: 'var(--dr-primary)', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>
            Tonal Serenity
          </h1>
          <p style={{ color: 'var(--dr-on-surface-variant)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.2em' }}>
            Digital Health Sanctuary
          </p>
        </header>

        {/* 1. Access Section */}
        <section className="pt-card-glass">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--dr-primary-container)', color: 'var(--dr-on-primary-container)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
              <span className="material-symbols-outlined" style={{ marginLeft: '12px' }}>key</span>
            </div>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.5rem', fontWeight: 800 }}>Secure Patient Access</h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="dr-label">Validated Phone Number</label>
              <input className="pt-input-flat" placeholder="+1 (555) 000-0000" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="dr-label">Prescription Access Code</label>
              <input className="pt-input-flat" placeholder="RX-0000" type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} maxLength={6} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <button className="pt-btn-main" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                {loading ? "Authenticating..." : (
                  <>View Secure Prescription <span className="material-symbols-outlined">arrow_forward</span></>
                )}
              </button>
            </div>
          </form>

          {error && (
            <p style={{ marginTop: '1.5rem', color: 'var(--dr-error)', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>error</span>
              {error}
            </p>
          )}
          {!prescription && !loading && (
            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--dr-on-surface-variant)', fontStyle: 'italic' }}>
              Waiting for secure authentication...
            </p>
          )}
        </section>

        {prescription && (
          <>
            {/* 2. Overview Card */}
            <section className="pt-card-glass">
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>
                <div>
                  <h3 className="dr-label" style={{ color: 'var(--dr-primary)', marginBottom: '1.25rem' }}>Patient Presentation</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {report.SYMPTOMS ? report.SYMPTOMS.split(',').map((symptom, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--dr-on-surface)', fontSize: '0.95rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--dr-secondary)' }} />
                        {symptom.trim()}
                      </li>
                    )) : (
                      <li style={{ color: 'var(--dr-on-surface-variant)', opacity: 0.6 }}>No specific symptoms noted.</li>
                    )}
                  </ul>
                </div>
                <div style={{ background: 'var(--dr-surface-container-low)', padding: '1.5rem', borderRadius: '24px' }}>
                  <h3 className="dr-label" style={{ color: 'var(--dr-primary)', marginBottom: '0.75rem' }}>Diagnosis</h3>
                  <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: 'var(--dr-on-surface)', marginBottom: '0.5rem' }}>
                    {report.DIAGNOSIS || "Clinical evaluation pending."}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--dr-on-surface-variant)', lineHeight: '1.5' }}>
                    Based on presented symptoms and preliminary examination.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Treatment Plan */}
            <section className="pt-card-glass">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.75rem', fontWeight: 800 }}>Pharmacological Plan</h2>
                <span className="pt-badge-small">Active Cycle</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {meds.map((med, idx) => (
                  <div key={idx} className="pt-medicine-card">
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--dr-primary-container)', color: 'var(--dr-on-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pill</span>
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <p style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.2rem' }}>{med.name}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--dr-on-surface-variant)', fontWeight: 600 }}>REGULATED THERAPY</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'right' }}>
                          <div>
                            <p className="dr-label" style={{ fontSize: '0.6rem', marginBottom: '0.2rem' }}>Frequency</p>
                            <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{med.frequency}</p>
                          </div>
                          <div>
                            <p className="dr-label" style={{ fontSize: '0.6rem', marginBottom: '0.2rem' }}>Duration</p>
                            <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{med.duration}</p>
                          </div>
                        </div>
                      </div>
                      <div style={{ borderTop: '1px solid rgba(172, 179, 183, 0.1)', paddingTop: '0.75rem' }}>
                        <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--dr-on-surface-variant)' }}>
                          Instruction: Take {med.dosage} precisely as directed.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Required Diagnostics */}
            <section className="pt-card-glass">
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Required Investigations</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {(report.TESTS || "No tests ordered.").split(',').map((test, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'var(--dr-surface-container-low)', borderRadius: '20px', border: '1px solid rgba(172, 179, 183, 0.05)' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--dr-primary)' }}>biotech</span>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: '0.95rem' }}>{test.trim()}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--dr-on-surface-variant)', marginTop: '0.1rem' }}>DIAGNOSTIC VERIFICATION</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Lifestyle Advice */}
            <section className="pt-card-glass">
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Clinical Advice & Guidance</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1.25rem' }}>
                    <div style={{ background: 'rgba(0, 107, 98, 0.1)', padding: '0.75rem', borderRadius: '12px', height: 'fit-content' }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--dr-primary)' }}>restaurant</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, marginBottom: '0.25rem' }}>General Advice</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--dr-on-surface-variant)', lineHeight: '1.5' }}>
                        {report.ADVICE || "Continue standard care protocols."}
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ background: 'var(--dr-primary-container)', color: 'var(--dr-on-primary-container)', padding: '1.5rem', borderRadius: '24px' }}>
                  <p className="dr-label" style={{ color: 'var(--dr-on-primary-container)', opacity: 0.6, marginBottom: '0.75rem' }}>Physician's Summary</p>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.6', fontWeight: 600, fontStyle: 'italic' }}>
                    "The prescribed treatment is aimed at rapid stabilization. Retain this digital document for verification at any licensed pharmacy or pathology lab."
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Follow-up & Doctor Profile */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '8rem' }}>
              <section className="pt-card-glass" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ background: 'var(--dr-primary)', color: 'white', padding: '1rem', borderRadius: '20px', textAlign: 'center', minWidth: '80px' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>NEXT VISIT</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>{report['FOLLOW-UP'] ? report['FOLLOW-UP'].split('-')[0].trim() : '--'}</p>
                </div>
                <div>
                  <h3 style={{ fontWeight: 800, marginBottom: '0.1rem' }}>Review Session</h3>
                  <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Clinical follow-up required</p>
                </div>
              </section>

              <section className="pt-card-glass" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--dr-outline-variant)', overflow: 'hidden' }}>
                  <img src="/api/placeholder/64/64" alt="Doctor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 900 }}>Dr. Alistair Vance</h3>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--dr-primary)' }}>Internal Medicine Center</p>
                  <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>Reg #MED-772911-X</p>
                </div>
              </section>
            </div>

            {/* 7. AI Assistant Sticky Bar */}
            <section className="pt-sticky-ai">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--dr-primary)', fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.1rem' }}>Prescription Virtual Assistant</h3>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input 
                  className="pt-ai-input" 
                  placeholder="Ask a question about your medication..." 
                  value={aiQuery} 
                  onChange={e => setAiQuery(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAiAsk()}
                />
                <button className="pt-ai-btn" onClick={handleAiAsk} disabled={isAiLoading}>
                  <span className="material-symbols-outlined">{isAiLoading ? 'hourglass_top' : 'send'}</span>
                </button>
              </div>
              
              {aiResponse && (
                <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--dr-surface-container-low)', borderRadius: '16px', borderLeft: '4px solid var(--dr-primary)' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--dr-on-surface)', lineHeight: '1.5' }}>{aiResponse}</p>
                </div>
              )}
              {isAiLoading && (
                 <p style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--dr-primary)', fontWeight: 700, letterSpacing: '0.1em' }}>CONSULTING CLINICAL ENGINE...</p>
              )}
               <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.6rem', color: 'var(--dr-on-surface-variant)', fontWeight: 800, textTransform: 'uppercase', opacity: 0.5 }}>
                 AI outputs are derived strictly from your official clinician data
               </p>
            </section>
          </>
        )}

      </main>

      <footer style={{ background: 'var(--dr-surface-container-lowest)', padding: '6rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(172, 179, 183, 0.1)' }}>
        <p className="dr-partner-tag" style={{ marginBottom: '1.5rem' }}>Clinical Sanctuary Precision Systems</p>
        <p style={{ fontSize: '0.85rem', opacity: 0.4, maxWidth: '500px', margin: '0 auto' }}>
          This digital prescription is a legally valid clinical record. 
          All interactions are logged for security and forensic audits.
        </p>
      </footer>
    </div>
  );
}
