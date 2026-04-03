"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  // Set landing page to Obsidian theme by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="dark min-h-screen selection:bg-primary-container selection:text-white overflow-hidden" style={{ backgroundColor: '#0b0c10' }}>
      {/* --- Ambient Sanctuary Accents --- */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-[0.05] blur-[120px] pointer-events-none" style={{ backgroundColor: '#346EF6' }}></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-[0.05] blur-[120px] pointer-events-none" style={{ backgroundColor: '#45a29e' }}></div>

      {/* --- Navigation Bar (Portal Landing Style) --- */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-[24px]" style={{ backgroundColor: 'rgba(11, 12, 16, 0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex justify-between items-center px-6 md:px-12 py-6 w-full max-w-1280 mx-auto">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl" style={{ color: '#346EF6' }}>clinical_notes</span>
            <span className="text-2xl font-black tracking-tighter font-headline" style={{ color: '#346EF6' }}>Doc-Help</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a className="text-xs font-bold uppercase tracking-[0.15em] transition-all" style={{ color: '#346EF6', borderBottom: '2px solid #346EF6', paddingBottom: '4px' }} href="#">Home</a>
            <a className="text-xs font-medium uppercase tracking-[0.15em] transition-all" style={{ color: 'var(--on-surface-variant)' }} href="#">Expertise</a>
            <a className="text-xs font-medium uppercase tracking-[0.15em] transition-all" style={{ color: 'var(--on-surface-variant)' }} href="#">Technology</a>
          </div>
          <Link href="/patient">
            <button className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem', fontWeight: '700' }}>
              Patient Portal
            </button>
          </Link>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 px-6 md:px-12 min-h-screen flex flex-col items-center justify-center">
        {/* --- Hero Editorial --- */}
        <header className="w-full max-w-[800px] text-center mb-20">
          <span className="inline-block px-4 py-1.5 mb-6 text-[0.625rem] font-bold uppercase tracking-[0.25em] rounded-full" style={{ color: '#45a29e', backgroundColor: 'rgba(69, 162, 158, 0.1)', border: '1px solid rgba(69, 162, 158, 0.2)' }}>
            Precision Healthcare Engineering
          </span>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-[-0.03em] leading-[1.1] mb-8" style={{ color: 'var(--on-surface)' }}>
            The Sanctuary for <span className="text-transparent bg-clip-text bg-gradient-primary-secondary">Clinical Excellence.</span>
          </h1>
          <p className="text-lg md:text-xl max-w-[600px] mx-auto leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
            Elevating the medical experience through surgical precision in design and digital architecture. Select your entry point to the obsidian laboratory.
          </p>
        </header>

        {/* --- Dual Interactive Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-1280 mx-auto">
          {/* Card 1: Doctor */}
          <Link href="/doctor" className="group relative overflow-hidden rounded-2xl transition-all duration-500" style={{ transform: 'scale(1)' }}>
            <div className="absolute inset-0 mesh-gradient-1 opacity-50"></div>
            <div className="relative p-10 md:p-14 flex flex-col h-full min-h-[420px] glass-card">
              <div className="flex-1">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-8" style={{ backgroundColor: 'rgba(52, 110, 246, 0.1)', border: '1px solid rgba(52, 110, 246, 0.2)' }}>
                  <span className="material-symbols-outlined text-4xl" style={{ color: '#346EF6' }}>stethoscope</span>
                </div>
                <h2 className="font-headline text-3xl font-bold mb-4" style={{ color: 'white' }}>Doctor Portal</h2>
                <p className="text-lg leading-relaxed max-w-[320px]" style={{ color: 'var(--on-surface-variant)' }}>
                  Access hyper-competent diagnostic tools, patient analytics, and real-time clinical data synchronization.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-12 text-[#346EF6]">
                <span className="text-xs font-bold uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform duration-500">Initialize Access</span>
                <span className="material-symbols-outlined group-hover:translate-x-4 transition-transform duration-500">arrow_forward</span>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaZMSMEAqg00BPx40pXQozx_YYsxJnyclE7Izw5Yf5twQPYByvePHWvAn6BZZdauHWKkQCaTT8M4ssYB_ocD7RovAy4bqHay0wxnGQQtjUIyxa5ej0ZIiFLZJ2AXdskZgRcf40cggatTLC5BANJcnOB-3AJY8KXNsdh_X72T111zLRZxrxfg5cBLlqs09KU4S2AoULjOomJ6JMp7ocl3ob4erhJSBzJNybhwZeTsm2Wb002zLklBVMgVG7V-OsD2JuUCyWS6AB2Ro" alt="" style={{ width: '120px', filter: 'grayscale(1)' }} />
            </div>
          </Link>

          {/* Card 2: Patient */}
          <Link href="/patient" className="group relative overflow-hidden rounded-2xl transition-all duration-500">
            <div className="absolute inset-0 mesh-gradient-2 opacity-50"></div>
            <div className="relative p-10 md:p-14 flex flex-col h-full min-h-[420px] glass-card">
              <div className="flex-1">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-8" style={{ backgroundColor: 'rgba(69, 162, 158, 0.1)', border: '1px solid rgba(69, 162, 158, 0.2)' }}>
                  <span className="material-symbols-outlined text-4xl" style={{ color: '#45a29e' }}>person</span>
                </div>
                <h2 className="font-headline text-3xl font-bold mb-4" style={{ color: 'white' }}>Patient Portal</h2>
                <p className="text-lg leading-relaxed max-w-[320px]" style={{ color: 'var(--on-surface-variant)' }}>
                  Your secure personal sanctuary. View health trajectories, consult experts, and manage your clinical records.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-12 text-[#45a29e]">
                <span className="text-xs font-bold uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform duration-500">Enter Sanctuary</span>
                <span className="material-symbols-outlined group-hover:translate-x-4 transition-transform duration-500">arrow_forward</span>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBxYTUzC2mFm7-kZ340xaPhCUzJLski_0JPK8r2NfK_TDt7lZBnc1lNjjLzhTQt5aOc5cQMePMrrUbn1FmAe1NUHXzbu8i6Owtz6X_uYVNMBBkl60fsI0jwaKs3bPxk04ebiDV8JFAIlXOnSwNLnBU350DHU70XidCWMUlNzrQY1ueUFF4kDUqikLYFpvFdZHm6O2oYus2J4PCAQmOjtOXrXqjZw91hxSrN1f0dmNnQitrOgfQ9FY7EJP_3vwgkVHRJCO2VNnLmA0" alt="" style={{ width: '120px', filter: 'grayscale(1)' }} />
            </div>
          </Link>
        </div>

        {/* --- Social Proof --- */}
        <div className="mt-32 w-full max-w-[800px] text-center opacity-40">
          <p className="text-[0.625rem] font-bold uppercase tracking-[0.3em] mb-10" style={{ color: 'var(--on-surface-variant)' }}>Validated Infrastructure Partners</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 font-headline font-black text-white tracking-tighter">
            <span style={{ fontSize: '1.25rem' }}>MED-DATA</span>
            <span style={{ fontSize: '1.25rem' }}>SECURE-CORE</span>
            <span style={{ fontSize: '1.25rem' }}>PRECISION-FLOW</span>
            <span style={{ fontSize: '1.25rem' }}>OPTIC-HEALTH</span>
          </div>
        </div>
      </main>

      <footer className="w-full py-16 px-6 md:px-12" style={{ backgroundColor: '#0d0e12', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-1280 mx-auto gap-8">
          <div className="flex flex-col gap-2">
            <div className="text-lg font-bold font-headline" style={{ color: '#346EF6' }}>Doc-Help</div>
            <p className="text-[0.625rem] font-medium uppercase tracking-[0.1em]" style={{ color: 'var(--on-surface-variant)' }}>
              © 2024 Doc-Help. Clinical Precision Engineering.
            </p>
          </div>
          <div className="flex gap-8 text-[0.625rem] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--on-surface-variant)' }}>
            <a href="#" className="hover:text-primary transition-colors">Security</a>
            <a href="#" className="hover:text-primary transition-colors">Technology</a>
            <a href="#" className="hover:text-primary transition-colors">Expertise</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
