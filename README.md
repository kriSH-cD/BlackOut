# 🩺 PRESCRIPTO — Digital Prescription Frontend

A modern, high-precision healthcare interface for doctors and patients. Built with **Next.js**, **Groq AI**, and high-end **Glassmorphism** styling.

---

## ✨ Features

### 👨‍⚕️ For Doctors
- **Obsidian Dashboard:** A premium, dark-themed interface designed for clinical efficiency.
- **AI Voice-to-Prescription:** Powered by **Groq Llama 3.1**, allowing doctors to speak consultation details and have them automatically structured into clinical data.
- **Secure Code Generation:** Generates a unique 6-character access code for every prescription.
- **Clinical Form Grains:** Structured fields for symptoms, diagnosis, medications, and follow-up plans.

### 🛌 For Patients
- **Effortless Retrieval:** Patients simply enter their phone number and the 6-character code to view their prescription instantly.
- **Glassmorphic UI:** A clean, responsive, and trustworthy design for viewing medical documents.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **AI Processing:** Groq SDK (Llama 3.1 8B)
- **Styling:** CSS Modules with Glassmorphic Design & Vibrance
- **Icons:** Google Material Symbols
- **State Management:** React Hooks (useEffect, useState, useRef)

---

## 🚀 Getting Started

### 1. Installation
```bash
cd frontend
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root of the `frontend` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── doctor/         # Physician Dashboard
│   ├── patient/        # Patient Access Portal
│   ├── layout.js       # Root Layout & Theme Configuration
│   └── globals.css     # Design System & UI Utils
├── lib/
│   ├── api.js          # Fastapi Backend Connectors
│   └── groq.js         # AI Logic & Structuring
└── public/             # Static Assets
```

---

## 🛡️ Security Check
- **No Private Data Stored Locally:** All prescriptions are persisted via the secure FastAPI backend and Supabase.
- **Environment Safety:** API keys are server-side or prefix-restricted.

---

## 🏛️ License
Part of the **PRESCRIPTO** Digital Ecosystem. © 2024.
