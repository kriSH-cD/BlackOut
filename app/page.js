'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="lp-bg">
      {/* Visual Infrastructure */}
      <div className="lp-grid" />
      <div className="lp-ambient lp-ambient-1" />
      <div className="lp-ambient lp-ambient-2" />

      {/* Navigation */}
      <nav className="lp-nav">
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#346EF6', borderRadius: '8px' }} />
            <span style={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#1e293b' }}>PRESCRIPTO</span>
          </div>
          <Link href="/doctor" style={{ 
            backgroundColor: '#346EF6', 
            color: '#ffffff', 
            padding: '0.6rem 1.25rem', 
            borderRadius: '99px', 
            fontSize: '0.75rem', 
            fontWeight: 700,
            textDecoration: 'none'
          }}>
            PHYSICIAN ACCESS
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="lp-hero">
        <div className="lp-badge">
          <div className="lp-badge-dot" />
          <span className="lp-badge-text">v2.4 Clinical Infrastructure Active</span>
        </div>
        
        <h1 className="lp-title lp-title-gradient">
          Prescripto
        </h1>
        
        <p className="lp-description font-bold">
          Smart prescriptions powered by voice and AI.
Automatically structured, always easy to understand.
Better care through intelligent technology.
        </p>
      </header>

      {/* Portal Entry Points */}
      <section className="lp-cards-grid">
        {/* Doctor Portal */}
        <Link href="/doctor" className="lp-card lp-card-dr">
          <div className="lp-icon-box">
            <span className="material-symbols-outlined" style={{ color: '#346EF6', fontSize: '32px' }}>stethoscope</span>
          </div>
          <h2 className="lp-card-title">Physician<br />Dashboard</h2>
          <p className="lp-card-text">
            Instrument your consultation with voice-to-text AI. Generate encrypted, 
            structured clinical records in real-time with high-fidelity accuracy.
          </p>
          <div className="lp-card-action" style={{ color: '#346EF6' }}>
            <span className="lp-action-text">Initialize Bio-Link</span>
            <div className="lp-card-line" />
          </div>
        </Link>

        {/* Patient Portal */}
        <Link href="/patient" className="lp-card lp-card-pt">
          <div className="lp-icon-box">
            <span className="material-symbols-outlined" style={{ color: '#45a29e', fontSize: '32px' }}>key</span>
          </div>
          <h2 className="lp-card-title">Patient<br />Dashboard</h2>
          <p className="lp-card-text">
            Secure retrieval of digital medical assets. Decrypt your clinical data 
            using high-entropy validation codes with temporary bio-availability.
          </p>
          <div className="lp-card-action" style={{ color: '#45a29e' }}>
            <span className="lp-action-text">Decrypt Records</span>
            <div className="lp-card-line" />
          </div>
        </Link>
      </section>

      {/* Partner Section */}
      <footer className="lp-partners">
        <div className="lp-partners-line" />
        <p className="lp-partners-tag">Validated Clinical Network Partners</p>
        <div className="lp-partners-list">
          <div className="lp-partner-item">BIOSYNC</div>
          <div className="lp-partner-item">NEUROCORE</div>
          <div className="lp-partner-item">HEALOS_AI</div>
          <div className="lp-partner-item">QUANTUM_MED</div>
        </div>
      </footer>
    </main>
  );
}
