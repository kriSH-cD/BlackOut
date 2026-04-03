"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Set landing page to Obsidian theme by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
    setIsLoaded(true);
  }, []);

  return (
    <div className="dark min-h-screen selection:bg-primary selection:text-white overflow-x-hidden" style={{ backgroundColor: '#0b0c10', color: '#c5c6c7' }}>
      
      {/* ─── Ambient Clinical Atmospheres ─────────────────────────────── */}
      <div className="fixed top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.08] blur-[140px] pointer-events-none animate-pulse" style={{ backgroundColor: '#346EF6' }}></div>
      <div className="fixed bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.08] blur-[140px] pointer-events-none animate-pulse" style={{ backgroundColor: '#45a29e', animationDelay: '2s' }}></div>
      
      {/* Dynamic Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

      {/* ─── Navigation Bar ───────────────────────────────────────────── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`} style={{ backgroundColor: 'rgba(11, 12, 16, 0.65)', backdropFilter: 'blur(32px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex justify-between items-center px-8 md:px-16 py-6 w-full max-w-1280 mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#346EF6] to-[#45a29e] shadow-[0_0_20px_rgba(52,110,246,0.3)]">
              <span className="material-symbols-outlined text-white text-2xl">clinical_notes</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight font-headline text-white">DOC-HELP</span>
              <span className="text-[0.6rem] font-bold tracking-[0.3em] uppercase opacity-40">Precision Systems</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-12">
            {['Expertise', 'Technology', 'Network', 'Security'].map((item) => (
              <a key={item} className="text-[0.65rem] font-bold uppercase tracking-[0.25em] opacity-40 hover:opacity-100 hover:text-[#346EF6] transition-all cursor-pointer" href="#">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-6">
             <Link href="/patient" className="text-[0.7rem] font-bold uppercase tracking-[0.15em] hover:text-[#45a29e] transition-colors">Patient Portal</Link>
             <Link href="/doctor">
              <button className="btn btn-primary" style={{ padding: '0.65rem 1.8rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '800' }}>
                Physician Access
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Editorial ───────────────────────────────────────────── */}
      <main className="relative pt-44 pb-32 px-8 min-h-screen flex flex-col items-center">
        <header className={`w-full max-w-[900px] text-center mb-28 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 px-5 py-2 mb-10 rounded-full bg-[rgba(52,110,246,0.06)] border border-[rgba(52,110,246,0.15)] shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <span className="flex h-2 w-2 rounded-full bg-[#346EF6] animate-ping"></span>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#346EF6]">Intelligence Phase v2.4 Active</span>
          </div>
          
          <h1 className="font-headline text-6xl md:text-8xl font-black tracking-[-0.04em] leading-[1] mb-10 text-white">
            Biological Data. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#346EF6] via-[#ffffff] to-[#45a29e] animate-gradient-x">Surgical Integrity.</span>
          </h1>
          
          <p className="text-xl md:text-2xl max-w-[700px] mx-auto leading-relaxed font-light opacity-60">
            A sanctuary for clinical precision. Seamlessly bridging biological consultation with high-integrity digital persistence.
          </p>
        </header>

        {/* ─── Dual Portal Matrices ───────────────────────────────────── */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-1280 mx-auto transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Physician Vector */}
          <Link href="/doctor" className="group relative overflow-hidden rounded-[32px] transition-all duration-700 bg-[#0d0e12] border border-white/5 hover:border-[#346EF6]/40 hover:shadow-[0_0_80px_rgba(52,110,246,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#346EF6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative p-12 md:p-16 flex flex-col h-full min-h-[480px]">
              <div className="flex-1">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 bg-white/5 border border-white/10 group-hover:bg-[#346EF6]/10 group-hover:border-[#346EF6]/30 transition-all duration-500">
                  <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform duration-500" style={{ color: '#346EF6' }}>emergency</span>
                </div>
                <h2 className="font-headline text-4xl font-bold mb-6 text-white tracking-tight">Physician Dashboard</h2>
                <p className="text-lg opacity-40 leading-relaxed max-w-[340px] group-hover:opacity-70 transition-opacity">
                  Instrument your consultation with voice-to-text AI, real-time clinical structuring, and secure persistence.
                </p>
              </div>
              <div className="flex items-center gap-6 text-[#346EF6]">
                <div className="h-[2px] w-12 bg-[#346EF6] origin-left group-hover:scale-x-150 transition-transform duration-700"></div>
                <span className="text-xs font-bold uppercase tracking-[0.3em]">Initialize Bio-Link</span>
              </div>
            </div>
            {/* Visual Flair */}
            <div className="absolute top-12 right-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 font-headline font-black text-8xl pointer-events-none">DR</div>
          </Link>

          {/* Patient Vector */}
          <Link href="/patient" className="group relative overflow-hidden rounded-[32px] transition-all duration-700 bg-[#0d0e12] border border-white/5 hover:border-[#45a29e]/40 hover:shadow-[0_0_80px_rgba(69,162,158,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#45a29e]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative p-12 md:p-16 flex flex-col h-full min-h-[480px]">
              <div className="flex-1">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 bg-white/5 border border-white/10 group-hover:bg-[#45a29e]/10 group-hover:border-[#45a29e]/30 transition-all duration-500">
                  <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform duration-500" style={{ color: '#45a29e' }}>fingerprint</span>
                </div>
                <h2 className="font-headline text-4xl font-bold mb-6 text-white tracking-tight">Patient Sanctuary</h2>
                <p className="text-lg opacity-40 leading-relaxed max-w-[340px] group-hover:opacity-70 transition-opacity">
                  Access your medical records through secure 6-character neural-hashes and phone-based biometric validation.
                </p>
              </div>
              <div className="flex items-center gap-6 text-[#45a29e]">
                <div className="h-[2px] w-12 bg-[#45a29e] origin-left group-hover:scale-x-150 transition-transform duration-700"></div>
                <span className="text-xs font-bold uppercase tracking-[0.3em]">Decrypt Records</span>
              </div>
            </div>
            {/* Visual Flair */}
            <div className="absolute top-12 right-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 font-headline font-black text-8xl pointer-events-none">PT</div>
          </Link>
        </div>

        {/* ─── Infrastructure Validation ─────────────────────────────── */}
        <div className={`mt-44 w-full flex flex-col items-center transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-px h-24 bg-gradient-to-b from-transparent to-white/10 mb-12"></div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.4em] mb-12 opacity-30">Validated Clinical Network Partners</p>
          <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-10 opacity-20 hover:opacity-50 transition-opacity duration-700">
            {['NEURAL-MED', 'SCRY-LABS', 'OB-TECH', 'SANCT-DS'].map(partner => (
              <span key={partner} className="font-headline font-black text-2xl tracking-tighter text-white">{partner}</span>
            ))}
          </div>
        </div>
      </main>

      {/* ─── Global Footer ───────────────────────────────────────────── */}
      <footer className="w-full py-24 px-8 border-top border-white/5 bg-[#08090d]/80 backdrop-blur-xl">
        <div className="max-w-1280 mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-md bg-[#346EF6] flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">shield_health</span>
              </div>
              <span className="text-lg font-black tracking-tight font-headline text-white">DOC-HELP</span>
            </div>
            <p className="text-xs opacity-40 max-w-[320px] leading-loose uppercase tracking-widest font-bold">
              Architecting the future of medical document integrity through asynchronous AI and zero-trust distribution.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-[0.6rem] font-black uppercase tracking-[0.35em] text-white">Framework</span>
            <div className="flex flex-col gap-3">
              {['Privacy Protocol', 'Medical Compliance', 'System Status'].map(l => (
                <a key={l} href="#" className="text-[0.65rem] font-bold uppercase tracking-[0.2em] opacity-30 hover:opacity-100 transition-opacity">{l}</a>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-[0.6rem] font-black uppercase tracking-[0.35em] text-white">Connect</span>
            <div className="flex flex-col gap-3">
              {['Lab Support', 'Expert Network', 'Documentation'].map(l => (
                <a key={l} href="#" className="text-[0.65rem] font-bold uppercase tracking-[0.2em] opacity-30 hover:opacity-100 transition-opacity">{l}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-1280 mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <span className="text-[0.55rem] font-bold uppercase tracking-[0.4em] opacity-20">© 2024 DOC-HELP CLINICAL SANCTUARY SYSTEMS. ALL RIGHTS RESERVED.</span>
           <div className="flex gap-10">
              <span className="text-[0.55rem] font-bold uppercase tracking-[0.4em] opacity-20">ISO-27001</span>
              <span className="text-[0.55rem] font-bold uppercase tracking-[0.4em] opacity-20">HIPAA-COMPLIANT</span>
           </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }
      `}</style>
    </div>
  );
}
