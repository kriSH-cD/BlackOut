'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DoctorSettings() {
  const router = useRouter();
  const [user, setUser] = useState({ name: "Doctor", physicianType: "General Physician", email: "" });
  
  // Fake settings state for the UI
  const [settings, setSettings] = useState({
    emailNotifs: true,
    autoProcess: true,
    darkMode: false,
    smsAlerts: false,
  });

  useEffect(() => {
    // When component mounts, load user from local storage
    const storedUser = localStorage.getItem('docHelpUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      // Constructing doctor's name from email if not strictly available, or display the object data
      setUser({
        name: parsed.email ? parsed.email.split('@')[0] : "Physician",
        physicianType: parsed.physicianType || "General Physician",
        email: parsed.email || "",
      });
    } else {
      // Not logged in! Redirect (optional, but good practice)
      router.push("/doctor/login");
    }
  }, [router]);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    // Clear localStorage and redirect to landing page
    localStorage.removeItem('docHelpToken');
    localStorage.removeItem('docHelpUser');
    router.push("/");
  };

  return (
    <div className="dr-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <header className="dr-header">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/doctor" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dr-primary)', letterSpacing: '-0.02em', cursor: 'pointer' }}>
                PRESCRIPTO
              </span>
            </Link>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--dr-outline-variant)', opacity: 0.3 }} />
            <span style={{ fontWeight: '600', color: 'var(--dr-on-surface-variant)', fontSize: '0.9rem' }}>Account Settings</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/doctor" style={{ textDecoration: 'none' }}>
              <button style={{ 
                color: 'var(--dr-primary)', 
                background: 'rgba(0,107,98,0.1)', 
                border: 'none', 
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem 8rem', flex: 1, width: '100%' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Preferences</h1>
          <p style={{ opacity: 0.6, fontSize: '1.1rem' }}>Manage your profile, feature settings, and account security.</p>
        </div>

        {/* Profile Details Card */}
        <section className="dr-card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--dr-primary)', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Dr. {user.name}</h2>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, opacity: 0.7, color: 'var(--dr-primary)' }}>{user.physicianType}</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.5, marginTop: '0.5rem' }}>{user.email}</p>
            </div>
          </div>
        </section>

        {/* Feature Options */}
        <section className="dr-card" style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem' }}>Feature Integrations</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Setting Item */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Auto-Process Audio Transcripts</p>
                <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Automatically feed Whisper transcriptions into the Groq AI.</p>
              </div>
              <button 
                onClick={() => handleToggle('autoProcess')}
                style={{
                  width: '48px', height: '24px', borderRadius: '12px', border: 'none',
                  backgroundColor: settings.autoProcess ? 'var(--dr-primary)' : 'var(--dr-outline-variant)',
                  position: 'relative', cursor: 'pointer', transition: 'all 0.2s'
                }}>
                <div style={{ 
                  width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white',
                  position: 'absolute', top: '2px', left: settings.autoProcess ? '26px' : '2px', transition: 'all 0.2s'
                }} />
              </button>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--dr-outline-variant)', opacity: 0.3 }} />

            {/* Setting Item */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Email Notifications</p>
                <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Receive weekly summaries of prescriptions generated.</p>
              </div>
              <button 
                onClick={() => handleToggle('emailNotifs')}
                style={{
                  width: '48px', height: '24px', borderRadius: '12px', border: 'none',
                  backgroundColor: settings.emailNotifs ? 'var(--dr-primary)' : 'var(--dr-outline-variant)',
                  position: 'relative', cursor: 'pointer', transition: 'all 0.2s'
                }}>
                <div style={{ 
                  width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white',
                  position: 'absolute', top: '2px', left: settings.emailNotifs ? '26px' : '2px', transition: 'all 0.2s'
                }} />
              </button>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--dr-outline-variant)', opacity: 0.3 }} />

            {/* Setting Item */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>System Dark Mode</p>
                <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Force the dashboard to render in dark mode.</p>
              </div>
              <button 
                onClick={() => handleToggle('darkMode')}
                style={{
                  width: '48px', height: '24px', borderRadius: '12px', border: 'none',
                  backgroundColor: settings.darkMode ? 'var(--dr-primary)' : 'var(--dr-outline-variant)',
                  position: 'relative', cursor: 'pointer', transition: 'all 0.2s'
                }}>
                <div style={{ 
                  width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white',
                  position: 'absolute', top: '2px', left: settings.darkMode ? '26px' : '2px', transition: 'all 0.2s'
                }} />
              </button>
            </div>

          </div>
        </section>

        {/* Security & Logout */}
        <section className="dr-card" style={{ backgroundColor: 'rgba(186, 26, 26, 0.02)', borderColor: 'rgba(186, 26, 26, 0.1)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--dr-error)' }}>Danger Zone</h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '2rem' }}>
            Logging out clears your active secure token. You will need to re-authenticate with your email and password to access clinical notes again.
          </p>
          <button 
            onClick={handleLogout}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              backgroundColor: 'var(--dr-error)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '1rem', 
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}>
            <span className="material-symbols-outlined">logout</span>
            Sign Out of Prescripto
          </button>
        </section>

      </main>
    </div>
  );
}
