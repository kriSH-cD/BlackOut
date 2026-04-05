'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DoctorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      // Store token
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
      <div className="lp-ambient lp-ambient-2" />

      {/* Navigation Header */}
      <nav className="lp-nav" style={{ position: 'absolute' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#346EF6', borderRadius: '8px' }} />
            <span style={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#1e293b' }}>PRESCRIPTO</span>
          </Link>
        </div>
      </nav>

      {/* Login Card */}
      <div className="lp-card" style={{ maxWidth: '440px', width: '100%', padding: '3rem', zIndex: 10, minHeight: 'auto' }}>
        <div className="lp-icon-box" style={{ marginBottom: '1.5rem', margin: '0 auto 1.5rem', width: '56px', height: '56px' }}>
          <span className="material-symbols-outlined" style={{ color: '#346EF6', fontSize: '28px' }}>lock</span>
        </div>
        
        <h2 className="lp-card-title" style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>
          Physician Login
        </h2>
        <p className="lp-card-text" style={{ textAlign: 'center', margin: '0 auto 2.5rem', fontSize: '1rem' }}>
          Secure access to your clinical dashboard.
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {errorMsg && (
            <div style={{ color: '#ba1a1a', backgroundColor: '#f9dedc', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
              {errorMsg}
            </div>
          )}

          <div>
            <label className="dr-label" style={{ marginBottom: '0.5rem', color: '#4b5563' }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 1rem', transition: 'box-shadow 0.2s', ...((email ? { boxShadow: 'inset 0 0 0 2px #346EF6', borderColor: 'transparent' } : {})) }}>
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
            <label className="dr-label" style={{ marginBottom: '0.5rem', color: '#4b5563' }}>Security Password</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 1rem', transition: 'box-shadow 0.2s', ...((password ? { boxShadow: 'inset 0 0 0 2px #346EF6', borderColor: 'transparent' } : {})) }}>
              <span className="material-symbols-outlined" style={{ color: '#94a3b8', fontSize: '20px', marginRight: '0.5rem' }}>key</span>
              <input 
                type="password" 
                required
                placeholder="Enter your password" 
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
              backgroundColor: '#346EF6', 
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
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 14px 0 rgba(52, 110, 246, 0.39)',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Authenticating...' : 'Access Dashboard'}
            {!isLoading && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link href="/doctor/signup" style={{ color: '#346EF6', fontWeight: 700, textDecoration: 'none' }}>
            Request Access
          </Link>
        </div>
      </div>
    </main>
  );
}
