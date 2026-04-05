'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createPrescription, transcribeAudio } from "@/lib/api";
import { processWithAI } from "@/lib/ai";

export default function DoctorDashboard() {
  const [doctorInfo, setDoctorInfo] = useState({
    name: "Dr. Elena Mirren",
    qualification: "MBBS, MD",
    regNo: "MC-22340-A",
    clinic: "Serenity Integrated Care Clinic",
  });

  const [patientInfo, setPatientInfo] = useState({
    name: "",
    phone: "",
  });

  const [clinicalNotes, setClinicalNotes] = useState({
    symptoms: "",
    diagnosis: "",
    tests: "",
    advice: "",
    nextVisit: "",
    reviewNotes: "",
  });

  const [medicines, setMedicines] = useState([
    { name: "Paracetamol 500mg", dosage: "1-0-1", frequency: "TDS", duration: "5 Days", instructions: "After Food" },
  ]);

  const [prescriptionCode, setPrescriptionCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [copied, setCopied] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        chunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
          setIsProcessing(true);
          try {
            const result = await transcribeAudio(audioBlob);
            if (result && result.text) {
              setTranscription(result.text);
              // Auto-process with Groq directly after transcription
              await handleTranscriptProcessing(result.text);
            }
          } catch (err) {
            console.error("Transcription failed", err);
            alert("Transcription failed. Please try again.");
          } finally {
            setIsProcessing(false);
          }
          
          // Stop all tracks to release the microphone
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone", err);
        alert("Could not access microphone.");
      }
    }
  };

  const handleTranscriptProcessing = async (textToProcess) => {
    const text = textToProcess || transcription;
    if (!text.trim()) return;
    setIsProcessing(true);
    try {
      const structuredData = await processWithAI(text);
      if (structuredData) {
        setClinicalNotes(prev => ({
          ...prev,
          symptoms: structuredData.clinical_presentation?.symptoms || prev.symptoms,
          diagnosis: structuredData.clinical_presentation?.primary_diagnosis || prev.diagnosis,
          tests: Array.isArray(structuredData.recommended_tests) ? structuredData.recommended_tests.join(", ") : (structuredData.recommended_tests || prev.tests),
          advice: structuredData.lifestyle_advice || prev.advice,
        }));
        if (structuredData.pharmacological_treatment && Array.isArray(structuredData.pharmacological_treatment)) {
          const mappedMeds = structuredData.pharmacological_treatment.map(m => ({
            name: m.medicine_name || "",
            dosage: m.frequency || "", // Mapped to the Freq. input field
            frequency: "",
            duration: m.duration || "",
            instructions: m.instructions || ""
          }));
          setMedicines(mappedMeds.length > 0 ? mappedMeds : medicines);
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
    if (!patientInfo.phone || patientInfo.phone.replace(/\D/g, "").length < 10) {
      alert("A valid 10-digit patient contact number is required.");
      return;
    }

    setIsProcessing(true);
    try {
      const medsString = medicines
        .filter(m => m.name.trim() !== "")
        .map(m => `${m.name} (${m.dosage}, ${m.frequency}, ${m.duration})`)
        .join("; ");

      const fullReport = `
SYMPTOMS: ${clinicalNotes.symptoms || "N/A"}
DIAGNOSIS: ${clinicalNotes.diagnosis || "N/A"}
TESTS: ${clinicalNotes.tests || "N/A"}
ADVICE: ${clinicalNotes.advice || "N/A"}
FOLLOW-UP: ${clinicalNotes.nextVisit || "Not scheduled"} - ${clinicalNotes.reviewNotes || ""}
      `.trim();

      const canonicalPhone = patientInfo.phone.replace(/\D/g, "");
      const result = await createPrescription(canonicalPhone, medsString, fullReport);
      
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const result = await transcribeAudio(file);
      if (result && result.text) {
        setTranscription(result.text);
        await handleTranscriptProcessing(result.text);
        alert("✅ File transcribed and processed successfully!");
      }
    } catch (err) {
      console.error("File transcription failed", err);
      alert("Error processing audio file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(prescriptionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dr-bg">
      {/* Top Navigation */}
      <header className="dr-header">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dr-primary)', letterSpacing: '-0.02em' }}>
              PRESCRIPTO
            </span>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--dr-outline-variant)', opacity: 0.3 }} />
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--dr-surface-container-low)', padding: '0.5rem 1.25rem', borderRadius: '99px', gap: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--dr-outline)' }}>search</span>
              <input type="text" placeholder="Find patient record..." style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.85rem', width: '200px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="material-symbols-outlined" style={{ color: 'var(--dr-on-surface-variant)', background: 'transparent', border: 'none', cursor: 'pointer' }}>mic</button>
            <button className="material-symbols-outlined" style={{ color: 'var(--dr-on-surface-variant)', background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative' }}>
              notifications
              <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', backgroundColor: 'var(--dr-error)', borderRadius: '50%', border: '2px solid white' }} />
            </button>
            <button className="material-symbols-outlined" style={{ color: 'var(--dr-on-surface-variant)', background: 'transparent', border: 'none', cursor: 'pointer' }}>settings</button>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--dr-outline-variant)', overflow: 'hidden', marginLeft: '0.5rem' }}>              {/* Removed placeholder image */}
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem 8rem' }}>
        {/* Section 1: Voice Input & File Upload */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <section className="dr-card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <button className={`dr-btn-mic ${isRecording ? 'active' : ''}`} onClick={toggleRecording}>
                  <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>mic</span>
                </button>
                {isRecording && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--dr-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--dr-primary)', borderRadius: '50%', animation: 'lp-pulse 1s infinite' }} />
                    Recording...
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <label className="dr-label">Consultation Audio Capture</label>
                <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '0.5rem' }}>Real-time dictation using Whisper AI</p>
              </div>
            </div>
          </section>

          <section className="dr-card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <label className="dr-label">Direct Clinical Audio Upload</label>
              <div style={{ 
                border: '2px dashed var(--dr-outline-variant)', 
                borderRadius: '16px', 
                padding: '1.25rem', 
                textAlign: 'center',
                backgroundColor: 'rgba(0, 107, 98, 0.02)',
                position: 'relative',
                cursor: 'pointer'
              }}>
                <input 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleFileUpload}
                  style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    opacity: 0, 
                    cursor: 'pointer' 
                  }} 
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--dr-primary)' }}>upload_file</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--dr-on-surface-variant)' }}>
                    Drop record or click to select
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Transcript Result */}
        <section className="dr-card">
          <label className="dr-label">Clinical Intelligence Output</label>
          <div className="dr-transcript-box">
            {transcription || "Initialize consultation audio capture or upload a recording..."}
            {isProcessing && <p style={{ color: 'var(--dr-primary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Analyzing clinical dialogue with Whisper v3...</p>}
          </div>
        </section>

        {/* Patient Contact Info */}
        <section className="dr-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Patient Identification</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <label className="dr-label">Full Name</label>
              <input className="dr-input" placeholder="e.g. John Doe" value={patientInfo.name} onChange={e => setPatientInfo({...patientInfo, name: e.target.value})} />
            </div>
            <div>
              <label className="dr-label">Contact Number (Primary Key)</label>
              <input className="dr-input" placeholder="10-digit phone number" value={patientInfo.phone} onChange={e => setPatientInfo({...patientInfo, phone: e.target.value})} />
            </div>
          </div>
        </section>

        {/* Clinical Presentation */}
        <section className="dr-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Clinical Presentation</h2>
          <div style={{ marginBottom: '2rem' }}>
            <label className="dr-label">Symptoms & Chief Complaint</label>
            <textarea className="dr-input" style={{ minHeight: '100px' }} placeholder="Describe patient complaints..." value={clinicalNotes.symptoms} onChange={e => setClinicalNotes({...clinicalNotes, symptoms: e.target.value})} />
          </div>
          <div>
            <label className="dr-label">Primary Diagnosis</label>
            <input className="dr-input" placeholder="Confirm clinical diagnosis..." value={clinicalNotes.diagnosis} onChange={e => setClinicalNotes({...clinicalNotes, diagnosis: e.target.value})} />
          </div>
        </section>

        {/* Pharmacological Treatment */}
        <section className="dr-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Pharmacological Treatment</h2>
            <button className="dr-btn-add" onClick={addMedicineRow}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              Add Medicine
            </button>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            {medicines.map((med, index) => (
              <div key={index} className="dr-medicine-row">
                <div>
                  <label className="dr-label">Medicine Name</label>
                  <input className="dr-input" value={med.name} onChange={e => updateMedicine(index, 'name', e.target.value)} />
                </div>
                <div>
                  <label className="dr-label">Freq.</label>
                  <input className="dr-input" style={{ textAlign: 'center' }} value={med.dosage} onChange={e => updateMedicine(index, 'dosage', e.target.value)} />
                </div>
                <div>
                  <label className="dr-label">Durat.</label>
                  <input className="dr-input" style={{ textAlign: 'center' }} value={med.duration} onChange={e => updateMedicine(index, 'duration', e.target.value)} />
                </div>
                <div>
                  <label className="dr-label">Instructions</label>
                  <input className="dr-input" value={med.instructions} onChange={e => updateMedicine(index, 'instructions', e.target.value)} />
                </div>
                <button className="material-symbols-outlined" style={{ color: 'var(--dr-error)', border: 'none', background: 'transparent', cursor: 'pointer', opacity: 0.5 }} onClick={() => removeMedicine(index)}>delete</button>
              </div>
            ))}
          </div>
        </section>

        {/* Investigations & Advice */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <section className="dr-card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Recommended Tests</h2>
            <textarea className="dr-input" style={{ minHeight: '80px' }} placeholder="Blood tests, X-ray..." value={clinicalNotes.tests} onChange={e => setClinicalNotes({...clinicalNotes, tests: e.target.value})} />
          </section>
          <section className="dr-card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Lifestyle Advice</h2>
            <textarea className="dr-input" style={{ minHeight: '80px' }} placeholder="Dietary restrictions..." value={clinicalNotes.advice} onChange={e => setClinicalNotes({...clinicalNotes, advice: e.target.value})} />
          </section>
        </div>

        {/* Follow-up & Signature */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
          <section className="dr-card">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Follow-up Schedule</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="dr-label">Next Visit Date</label>
              <input type="date" className="dr-input" value={clinicalNotes.nextVisit} onChange={e => setClinicalNotes({...clinicalNotes, nextVisit: e.target.value})} />
            </div>
            <div>
              <label className="dr-label">Review Notes</label>
              <input className="dr-input" placeholder="Verification required..." value={clinicalNotes.reviewNotes} onChange={e => setClinicalNotes({...clinicalNotes, reviewNotes: e.target.value})} />
            </div>
          </section>

          <section className="dr-card" style={{ backgroundColor: 'var(--dr-surface-container-low)', border: 'none' }}>
            <div className="dr-signature-box">
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--dr-primary)', opacity: 0.2 }}>edit</span>
            </div>
            <p className="dr-label">Physician Digital Authentication</p>
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{doctorInfo.name}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 600 }}>{doctorInfo.qualification}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Reg: {doctorInfo.regNo}</p>
            </div>
          </section>
        </div>

        {/* Generate Action */}
        <section style={{ marginTop: '6rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
          <button className="dr-btn-primary" onClick={handleCreatePrescription} disabled={isProcessing}>
            {isProcessing ? "Processing..." : (
              <><span className="material-symbols-outlined">description</span> Generate Prescription Code</>
            )}
          </button>

          {prescriptionCode && (
            <div className="dr-code-box">
              <div>
                <p className="dr-label" style={{ marginBottom: '0.5rem' }}>Prescription Code</p>
                <p className="dr-code-text">{prescriptionCode}</p>
              </div>
              <button onClick={copyCode} style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid var(--dr-outline-variant)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 700 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{copied ? 'check' : 'content_copy'}</span>
                {copied ? 'Copied' : 'Copy Code'}
              </button>
            </div>
          )}
        </section>
      </main>

      <footer style={{ backgroundColor: 'var(--dr-surface-container)', padding: '6rem 2rem', textAlign: 'center' }}>
        <p className="dr-partner-tag" style={{ marginBottom: '1.5rem' }}>Powered by Tonal Serenity AI</p>
        <p style={{ fontSize: '0.85rem', opacity: 0.5, maxWidth: '500px', margin: '0 auto' }}>
          © 2024 Clinical Sanctuary Systems. All data encrypted and HIPAA compliant.
          Precision documentation for modern healthcare professionals.
        </p>
      </footer>
    </div>
  );
}
