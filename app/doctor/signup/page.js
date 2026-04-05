'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DoctorSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [physicianType, setPhysicianType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, physicianType })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      // Store token (e.g. in localStorage)
      localStorage.setItem('docHelpToken', data.token);
      localStorage.setItem('docHelpUser', JSON.stringify(data.user));
      window.location.href = '/doctor';
    } catch (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  };

  return (
    <main className="lp-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      {/* Visual Infrastructure from Landing Page */}
      <div className="lp-grid" />
      <div className="lp-ambient lp-ambient-1" />
      <div className="lp-ambient lp-ambient-2" style={{ backgroundColor: '#45a29e' }} />

      {/* Navigation Header */}
      <nav className="lp-nav" style={{ position: 'absolute' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#346EF6', borderRadius: '8px' }} />
            <span style={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#1e293b' }}>PRESCRIPTO</span>
          </Link>
        </div>
      </nav>

      {/* Signup Card */}
      <div className="lp-card" style={{ maxWidth: '480px', width: '100%', padding: '3rem', zIndex: 10, minHeight: 'auto', marginTop: '4rem' }}>
        <div className="lp-icon-box" style={{ marginBottom: '1.5rem', margin: '0 auto 1.5rem', width: '56px', height: '56px', backgroundColor: 'rgba(69, 162, 158, 0.1)', borderColor: 'rgba(69, 162, 158, 0.2)' }}>
          <span className="material-symbols-outlined" style={{ color: '#45a29e', fontSize: '28px' }}>person_add</span>
        </div>
        
        <h2 className="lp-card-title" style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>
          Doctor Registration
        </h2>
        <p className="lp-card-text" style={{ textAlign: 'center', margin: '0 auto 2.5rem', fontSize: '1rem' }}>
          Initialize your secure clinical profile.
        </p>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {errorMsg && (
            <div style={{ color: '#ba1a1a', backgroundColor: '#f9dedc', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
              {errorMsg}
            </div>
          )}

          <div>
            <label className="dr-label" style={{ marginBottom: '0.5rem', color: '#4b5563' }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 1rem', transition: 'box-shadow 0.2s', ...((email ? { boxShadow: 'inset 0 0 0 2px #45a29e', borderColor: 'transparent' } : {})) }}>
              <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: '20px', marginRight: '0.5rem' }}>email</span>
              <input 
                type="email" 
                required
                placeholder="doctor@clinic.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', padding: '1rem 0', outline: 'none', fontSize: '0.95rem', color: '#0f172a' }} 
              />
            </div>
          </div>

          <div>
            <label className="dr-label" style={{ marginBottom: '0.5rem', color: '#4b5563' }}>Doctor Type / Specialty</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 1rem', transition: 'box-shadow 0.2s', ...((physicianType ? { boxShadow: 'inset 0 0 0 2px #45a29e', borderColor: 'transparent' } : {})) }}>
              <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: '20px', marginRight: '0.5rem' }}>stethoscope</span>
              <select 
                required
                value={physicianType}
                onChange={(e) => setPhysicianType(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', padding: '1rem 0', outline: 'none', fontSize: '0.95rem', color: physicianType ? '#0f172a' : '#94a3b8', cursor: 'pointer' }} 
              >
                <option value="" disabled>Select specialization</option>
                <option value="General Practitioner">General Physician</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Psychiatrist">Psychiatrist</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="dr-label" style={{ marginBottom: '0.5rem', color: '#4b5563' }}>Security Password</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 1rem', transition: 'box-shadow 0.2s', ...((password ? { boxShadow: 'inset 0 0 0 2px #45a29e', borderColor: 'transparent' } : {})) }}>
              <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: '20px', marginRight: '0.5rem' }}>key</span>
              <input 
                type="password" 
                required
                placeholder="Create a strong password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', padding: '1rem 0', outline: 'none', fontSize: '0.95rem', color: '#0f172a' }} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              backgroundColor: '#45a29e', 
              color: '#ffffff', 
              padding: '1rem', 
              borderRadius: '12px', 
              fontSize: '1rem', 
              fontWeight: 700,
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              boxShadow: '0 4px 14px 0 rgba(69, 162, 158, 0.39)',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Creating Profile...' : 'Initialize Bio-Link'}
            {!isLoading && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>how_to_reg</span>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
          Already have verified credentials?{' '}
          <Link href="/doctor/login" style={{ color: '#2b6cb0', fontWeight: 700, textDecoration: 'none' }}>
            Access Portal
          </Link>
        </div>
      </div>
    </main>
  );
}
