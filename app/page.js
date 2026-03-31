"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="page-container">
      <div className="home-container">
        {/* Floating decorative orb */}
        <div className="hero-orb" aria-hidden="true"></div>

        {/* Logo + Title */}
        <div className="hero-badge">🩺</div>
        <h1 className="home-title">Doc-Help</h1>
        <p className="home-subtitle">
          Secure digital prescriptions — created by doctors, accessed by
          patients with a one-time code.
        </p>

        {/* Role selection cards */}
        <div className="home-cards">
          <Link href="/doctor" className="role-card" id="card-doctor">
            <span className="role-icon">👨‍⚕️</span>
            <h2 className="role-title">Doctor</h2>
            <p className="role-desc">
              Create prescriptions using text or voice input with AI assistance.
            </p>
            <span className="card-arrow">→</span>
          </Link>

          <Link href="/patient" className="role-card" id="card-patient">
            <span className="role-icon">🧑‍💼</span>
            <h2 className="role-title">Patient</h2>
            <p className="role-desc">
              Retrieve your prescription using the access code from your doctor.
            </p>
            <span className="card-arrow">→</span>
          </Link>
        </div>

        {/* Footer tagline */}
        <p className="home-footer">
          <span className="footer-dot"></span>
          End-to-end encrypted &nbsp;·&nbsp; Codes expire in 10 minutes
        </p>
      </div>
    </div>
  );
}
