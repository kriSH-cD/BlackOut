"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { verifyCode } from "../../lib/api";

export default function PatientPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrescription(null);

    // Canonicalize phone for lookup (remove all non-digits)
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
    } catch (err) {
      setError(err.message || "Invalid or expired code. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch { return dateStr; }
  };

  return (
    <div className={`min-h-screen mesh-gradient-1 selection:bg-primary-container`}>
      {/* --- Navigation --- */}
      <nav className="st-nav">
        <div className="max-w-1280 mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="st-icon-box"><span className="material-symbols-outlined">shield_with_heart</span></div>
            <span className="text-lg font-bold tracking-tight font-headline" style={{ color: 'var(--color-primary)' }}>
              Clinical Sanctuary
            </span>
          </div>
          <Link href="/" className="nav-link" style={{ fontSize: '0.75rem' }}>Portal Home</Link>
        </div>
      </nav>

      <main className="st-container max-w-1280 mx-auto px-6 py-12">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 className="text-4xl font-extrabold font-headline tracking-tight" style={{ color: 'var(--on-surface)' }}>
              Prescription Retrieval
            </h1>
            <p style={{ color: 'var(--on-surface-variant)', marginTop: '1rem' }}>
              Enter your secure credentials to bypass manual registries.
            </p>
          </header>

          <section className="st-section glass-card">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="form-group">
                <label className="form-label">Patient Contact Number</label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', opacity: 0.4 }}>call</span>
                  <input 
                    className="form-input" 
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="9876543210" 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Secure Access Code</label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', opacity: 0.4 }}>lock</span>
                  <input 
                    className="form-input" 
                    style={{ paddingLeft: '2.5rem', letterSpacing: '0.2em', fontWeight: 700 }}
                    placeholder="A1B2C3" 
                    type="text" 
                    maxLength={6}
                    value={code} 
                    onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} 
                  />
                </div>
              </div>

              <button className="btn btn-primary w-full py-4" disabled={loading}>
                {loading ? <div className="spinner"></div> : <><span className="material-symbols-outlined">unlock</span> Retrieve Prescription</>}
              </button>
            </form>

            {error && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(186, 26, 26, 0.1)', color: 'var(--color-error)', borderRadius: '12px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                {error}
              </div>
            )}
          </section>

          {prescription && (
            <section className="st-section" style={{ marginTop: '2rem', border: '1px solid var(--color-primary)', background: 'rgba(52, 110, 246, 0.02)' }}>
              <div className="st-section-title" style={{ color: 'var(--color-primary)' }}>
                <div className="st-icon-box"><span className="material-symbols-outlined">verified</span></div>
                Authentic Clinical Record
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <label className="form-label" style={{ opacity: 0.5 }}>Patient Phone</label>
                  <p style={{ fontWeight: 600 }}>{prescription.phone}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <label className="form-label" style={{ opacity: 0.5 }}>Issued Date</label>
                  <p style={{ fontWeight: 600 }}>{formatDate(prescription.created_at)}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="form-label" style={{ opacity: 0.5 }}>Prescribed Medications</label>
                <div style={{ background: 'var(--bg-surface-container-low)', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid var(--color-primary)' }}>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{prescription.medicines}</p>
                </div>
              </div>

              <div>
                <label className="form-label" style={{ opacity: 0.5 }}>Physician's Report & Notes</label>
                <div style={{ background: 'var(--bg-surface-container-low)', padding: '1.25rem', borderRadius: '12px' }}>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.9rem' }}>{prescription.report_text}</p>
                </div>
              </div>

              <button className="btn btn-secondary w-full" style={{ marginTop: '2rem' }} onClick={() => window.print()}>
                <span className="material-symbols-outlined">print</span> Download Official Copy
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
