"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createPrescription } from "@/lib/api";
import { processWithGroq } from "@/lib/groq";

export default function DoctorDashboard() {
  // --- Theme State ---
  const [theme, setTheme] = useState("dark"); // Defaulting to dark (Obsidian) as requested previously

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  // --- Form & UI State ---
  const [doctorInfo, setDoctorInfo] = useState({
    name: "Dr. Julianne Moore",
    qualification: "MD, Cardiology",
    regNo: "MC-29401",
    clinic: "Sanctuary Medical Center, Wing B",
  });

  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    gender: "Male",
    date: new Date().toISOString().split("T")[0],
    phone: "",
  });

  const [clinicalNotes, setClinicalNotes] = useState({
    symptoms: "",
    diagnosis: "",
    tests: "",
    advice: "",
    followUpDate: "",
    followUpInstructions: "",
  });

  const [medicines, setMedicines] = useState([
    { name: "Amoxicillin 500mg", dosage: "1 Cap", frequency: "TDS (3x/day)", duration: "7 Days", instructions: "After Food" },
  ]);

  const [prescriptionCode, setPrescriptionCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [copied, setCopied] = useState(false);

  const recognitionRef = useRef(null);

  // --- Speech Recognition Setup ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              setTranscription((prev) => prev + event.results[i][0].transcript + " ");
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      handleTranscriptProcessing();
    } else {
      setTranscription("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleTranscriptProcessing = async () => {
    if (!transcription.trim()) return;
    setIsProcessing(true);
    try {
      const structuredData = await processWithGroq(transcription);
      if (structuredData) {
        if (structuredData.patient) {
          setPatientInfo(prev => ({ 
            ...prev, 
            name: structuredData.patient.name || prev.name,
            age: structuredData.patient.age || prev.age,
            gender: structuredData.patient.gender || prev.gender,
            phone: structuredData.patient.phone || prev.phone
          }));
        }
        setClinicalNotes(prev => ({
          ...prev,
          symptoms: structuredData.symptoms || prev.symptoms,
          diagnosis: structuredData.diagnosis || prev.diagnosis,
          tests: Array.isArray(structuredData.tests) ? structuredData.tests.join(", ") : (structuredData.tests || prev.tests),
          advice: structuredData.advice || prev.advice,
          followUpDate: structuredData.followUp?.date || prev.followUpDate,
          followUpInstructions: structuredData.followUp?.instructions || prev.followUpInstructions
        }));
        if (structuredData.medicines && Array.isArray(structuredData.medicines)) {
          setMedicines(structuredData.medicines.length > 0 ? structuredData.medicines : medicines);
        }
      }
    } catch (error) {
      console.error("AI Processing Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const addMedicineRow = () => {
    setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleCreatePrescription = async () => {
    if (!patientInfo.phone || patientInfo.phone.replace(/[^0-9]/g, "").length < 10) {
      alert("A valid 10-digit patient contact number is required for code-based retrieval.");
      return;
    }

    if (medicines.every(m => !m.name)) {
      alert("Please add at least one medication to the prescription.");
      return;
    }

    setIsProcessing(true);
    try {
      // Serialize medicine array into a clinical string for the backend
      const medsString = medicines
        .filter(m => m.name.trim() !== "")
        .map(m => `${m.name} (${m.dosage}, ${m.frequency}, ${m.duration})`)
        .join("; ");

      // Construct the comprehensive clinical report
      const fullReport = `
SYMPTOMS: ${clinicalNotes.symptoms || "N/A"}
DIAGNOSIS: ${clinicalNotes.diagnosis || "N/A"}
TESTS: ${clinicalNotes.tests || "N/A"}
ADVICE: ${clinicalNotes.advice || "N/A"}
FOLLOW-UP: ${clinicalNotes.followUpDate || "Not scheduled"} - ${clinicalNotes.followUpInstructions || "No additional instructions"}
      `.trim();

      // Canonicalize phone number (digits only) for reliable lookup
      const canonicalPhone = patientInfo.phone.replace(/\D/g, "");

      // Fix: API expects (phone, medicines, reportText) as separate arguments
      const result = await createPrescription(canonicalPhone, medsString, fullReport);
      
      // Fix: Backend returns 'access_code', not 'code'
      if (result && result.access_code) {
        setPrescriptionCode(result.access_code);
        alert("✅ Prescription generated successfully!");
      }
    } catch (error) {
      console.error("Prescription creation failed:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    if (confirm("Clear all active clinical data for a new patient?")) {
      setPatientInfo({ name: "", age: "", gender: "Male", date: new Date().toISOString().split("T")[0], phone: "" });
      setClinicalNotes({ symptoms: "", diagnosis: "", tests: "", advice: "", followUpDate: "", followUpInstructions: "" });
      setMedicines([{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
      setPrescriptionCode("");
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(prescriptionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* --- Navigation Bar (Stitch Exact) --- */}
      <nav className="st-nav">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-1280 mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-lg font-bold tracking-tight font-headline" style={{ color: 'var(--color-primary)' }}>
              Clinical Sanctuary
            </span>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="nav-link" style={{ fontSize: '0.75rem' }}>Portal Home</Link>
              <a className="font-body text-xs font-semibold" style={{ color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)', paddingBottom: '2px' }} href="#">Dashboard</a>
              <a className="nav-link" style={{ fontSize: '0.75rem' }} href="#">Patient Records</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined nav-icon-btn" style={{ fontSize: '20px' }}>notifications</button>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }} onClick={resetForm}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>refresh</span>
              Reset Form
            </button>
          </div>
        </div>
      </nav>

      {/* --- Main Dashboard --- */}
      <main className="st-container max-w-1280 mx-auto px-6 py-8">
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="text-4xl font-extrabold font-headline tracking-tight" style={{ color: 'var(--on-surface)' }}>
            Precision Prescription Engine
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', maxWidth: '600px', margin: '1rem auto' }}>
            Leverage voice-to-text intelligence to generate structured clinical documents with sanctuary-level clarity.
          </p>
        </header>

        {/* --- AI Voice Assistant Section --- */}
        <section className="st-section-low">
          <div className="mic-btn-wrap">
            <button className={`mic-btn ${isRecording ? 'listening' : ''}`} onClick={toggleRecording}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>{isRecording ? 'mic_off' : 'mic'}</span>
            </button>
            <div style={{ flex: 1 }}>
              <p className="form-label" style={{ marginBottom: '4px' }}>Real-time Transcription</p>
              <div className="chat-messages" style={{ height: 'auto', minHeight: '80px' }}>
                {transcription || "Listening for consultation details..."}
                {isProcessing && <div className="chat-message bot">Processing with AI...</div>}
              </div>
            </div>
          </div>
        </section>

        {/* --- Clinical Form --- */}
        <div className="grid-2">
          {/* Physician Profile */}
          <section className="st-section">
            <div className="st-section-title">
              <div className="st-icon-box"><span className="material-symbols-outlined">clinical_notes</span></div>
              Physician Profile
            </div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" value={doctorInfo.name} onChange={(e) => setDoctorInfo({...doctorInfo, name: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Qualification</label>
                <input className="form-input" type="text" value={doctorInfo.qualification} onChange={(e) => setDoctorInfo({...doctorInfo, qualification: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Reg No.</label>
                <input className="form-input" type="text" value={doctorInfo.regNo} onChange={(e) => setDoctorInfo({...doctorInfo, regNo: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Clinic Address</label>
              <input className="form-input" type="text" value={doctorInfo.clinic} onChange={(e) => setDoctorInfo({...doctorInfo, clinic: e.target.value})} />
            </div>
          </section>

          {/* Patient Information */}
          <section className="st-section">
            <div className="st-section-title">
              <div className="st-icon-box"><span className="material-symbols-outlined">person</span></div>
              Patient Information
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Patient Name</label>
                <input className="form-input" placeholder="John Doe" type="text" value={patientInfo.name} onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input className="form-input" placeholder="24" type="number" value={patientInfo.age} onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-input" value={patientInfo.gender} onChange={(e) => setPatientInfo({...patientInfo, gender: e.target.value})}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={patientInfo.date} onChange={(e) => setPatientInfo({...patientInfo, date: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Contact Number (For Code Search)</label>
              <input className="form-input" placeholder="+1 (555) 000-0000" type="tel" value={patientInfo.phone} onChange={(e) => setPatientInfo({...patientInfo, phone: e.target.value})} />
            </div>
          </section>
        </div>

        {/* Symptoms & Diagnosis */}
        <section className="st-section">
          <div className="st-section-title">
            <div className="st-icon-box"><span className="material-symbols-outlined">stethoscope</span></div>
            Symptoms & Diagnosis
          </div>
          <div className="form-group">
            <label className="form-label">Presenting Symptoms</label>
            <textarea className="form-textarea" placeholder="Describe the patient's complaints..." value={clinicalNotes.symptoms} onChange={(e) => setClinicalNotes({...clinicalNotes, symptoms: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Final Diagnosis</label>
            <textarea className="form-textarea" style={{ minHeight: '60px' }} placeholder="Enter clinical diagnosis..." value={clinicalNotes.diagnosis} onChange={(e) => setClinicalNotes({...clinicalNotes, diagnosis: e.target.value})} />
          </div>
        </section>

        {/* Medicines Table */}
        <section className="st-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div className="st-section-title" style={{ marginBottom: 0 }}>
              <div className="st-icon-box"><span className="material-symbols-outlined">medication</span></div>
              Prescribed Medications
            </div>
            <button className="btn btn-secondary" onClick={addMedicineRow}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              Add Medicine
            </button>
          </div>
          <div className="st-table-wrap">
            <table className="st-table">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med, index) => (
                  <tr key={index}>
                    <td><input className="form-input" style={{ background: 'transparent' }} value={med.name} onChange={(e) => updateMedicine(index, "name", e.target.value)} /></td>
                    <td><input className="form-input" style={{ background: 'transparent' }} value={med.dosage} onChange={(e) => updateMedicine(index, "dosage", e.target.value)} /></td>
                    <td><input className="form-input" style={{ background: 'transparent' }} value={med.frequency} onChange={(e) => updateMedicine(index, "frequency", e.target.value)} /></td>
                    <td><input className="form-input" style={{ background: 'transparent' }} value={med.duration} onChange={(e) => updateMedicine(index, "duration", e.target.value)} /></td>
                    <td>
                      <button className="material-symbols-outlined" style={{ color: 'var(--color-error)', cursor: 'pointer', border: 'none', background: 'transparent' }} onClick={() => removeMedicine(index)}>delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tests & Advice */}
        <div className="grid-2">
          <section className="st-section">
            <div className="st-section-title">
              <div className="st-icon-box"><span className="material-symbols-outlined">biotech</span></div>
              Recommended Tests
            </div>
            <textarea className="form-textarea" style={{ minHeight: '80px' }} placeholder="Blood tests, X-ray, MRI..." value={clinicalNotes.tests} onChange={(e) => setClinicalNotes({...clinicalNotes, tests: e.target.value})} />
          </section>
          <section className="st-section">
            <div className="st-section-title">
              <div className="st-icon-box"><span className="material-symbols-outlined">psychiatry</span></div>
              Advice & Notes
            </div>
            <textarea className="form-textarea" style={{ minHeight: '80px' }} placeholder="Avoid oily foods, increase hydration..." value={clinicalNotes.advice} onChange={(e) => setClinicalNotes({...clinicalNotes, advice: e.target.value})} />
          </section>
        </div>

        {/* Follow Up */}
        <section className="st-section">
          <div className="st-section-title">
            <div className="st-icon-box"><span className="material-symbols-outlined">event_repeat</span></div>
            Follow-Up Plan
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Follow-Up Date</label>
              <input className="form-input" type="date" value={clinicalNotes.followUpDate} onChange={(e) => setClinicalNotes({...clinicalNotes, followUpDate: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Follow-Up Instructions</label>
              <input className="form-input" placeholder="Bring previous reports..." type="text" value={clinicalNotes.followUpInstructions} onChange={(e) => setClinicalNotes({...clinicalNotes, followUpInstructions: e.target.value})} />
            </div>
          </div>
        </section>

        {/* Generate Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4rem 0' }}>
          <button className="btn btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.1rem' }} onClick={handleCreatePrescription} disabled={isProcessing}>
            {isProcessing ? <div className="spinner"></div> : <><span className="material-symbols-outlined">description</span> Generate Prescription Code</>}
          </button>

          {prescriptionCode && (
            <div style={{ marginTop: '2.5rem', width: '100%', maxWidth: '500px', background: 'rgba(52, 110, 246, 0.05)', padding: '2rem', borderRadius: '24px', border: '1px dashed var(--color-primary)', textAlign: 'center' }}>
              <label className="form-label" style={{ color: 'var(--color-primary)', opacity: 0.6 }}>Secure Prescription Code</label>
              <div className="font-headline" style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.2em', margin: '0.5rem 0' }}>
                {prescriptionCode}
              </div>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={copyCode}>
                <span className="material-symbols-outlined">{copied ? 'check' : 'content_copy'}</span>
                {copied ? 'Copied to Clipboard' : 'Copy Prescription Code'}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* --- Footer (Stitch Exact) --- */}
      <footer style={{ background: 'var(--bg-surface-container)', borderTop: '1px solid var(--outline-variant)', padding: '4rem 1.5rem' }}>
        <div className="st-container" style={{ padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div>
            <p className="font-headline" style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem' }}>Clinical Sanctuary Systems</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.6, maxWidth: '300px', lineHeight: '1.6' }}>Empowering modern medicine with structured data and seamless clinician workflows.</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '1rem' }}>© 2024 Clinical Sanctuary Systems. All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
            <a style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }} href="#">Privacy</a>
            <a style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }} href="#">Terms</a>
            <a style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }} href="#">Support</a>
          </div>
        </div>
      </footer>

      {/* --- Theme Toggle Button --- */}
      <button className="theme-toggle" onClick={toggleTheme}>
        <span className="material-symbols-outlined">{theme === "dark" ? "light_mode" : "dark_mode"}</span>
      </button>
    </div>
  );
}
