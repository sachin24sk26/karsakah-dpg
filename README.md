<div align="center">
  <h1>🌾 KARSAKAH (کاشتکار / किसान)</h1>
  <p><strong>Digital Public Good for Interoperable, Regenerative Agricultural Advisory</strong></p>
  <p><em>Track 4 Architecture &bull; BRICS Federated Node Network &bull; Smallholder Farmer Resilience</em></p>

  <p>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License: Apache-2.0"></a>
    <img src="https://img.shields.io/badge/DPG-Digital%20Public%20Good-green.svg" alt="Digital Public Good">
    <img src="https://img.shields.io/badge/OpenAPI-3.0.3-orange.svg" alt="OpenAPI 3.0">
    <img src="https://img.shields.io/badge/Nodes-India%20|%20Brazil%20|%20South%20Africa-purple.svg" alt="BRICS Nodes">
    <img src="https://img.shields.io/badge/Python-3.10+-yellow.svg" alt="Python Version">
  </p>
</div>

---

## 📖 About The Project

**KARSAKAH** is an open-source, interoperable **Digital Public Good (DPG)** built to empower smallholder farmers with **explainable, regenerative agricultural intelligence**, real-time weather risk alerts, multilingual speech interaction, and crop disease diagnosis.

Designed for global scaling across **BRICS+ nations**, KARSAKAH operates on a **config-driven multi-country architecture**: one unified codebase where regional crops, languages, agronomic rules, and currency units are declared via lightweight JSON profiles (`/country_profiles/{ISO}.json`).

---

## 🏛️ Target Architecture

```
Farmer (Web App / Multilingual Voice / WhatsApp Mock)
        │
        ▼
 KARSAKAH Front-End (Responsive, Accessible, Low-Bandwidth)
        │  REST (OpenAPI 3.0)
        ▼
 Advisory API Gateway (/v1/data, /v1/advisory, /v1/diagnose, /v1/node/info)
   ├── Data Connectors: Open-Meteo · SoilGrids (ISRIC 250m) · Sentinel-2 STAC · NASA POWER
   ├── Regenerative Rules Engine (Suitability, Rotation, Soil Health, Cover Mulch, Water Plan)
   ├── Multi-Modal Vision Engine (Gemini Vision + Structured JSON Schema + Confidence Gate)
   └── Country Profile Loader (/country_profiles/IN.json, BR.json, ZA.json)
        │
        ▼
 Node Registry & Federated Insight Exchange (Zero Raw-Data Leakage)
   🇮🇳 India Node (Punjab / ICAR) · 🇧🇷 Brazil Node (Cerrado / Embrapa) · 🇿🇦 South Africa Node (KZN / ARC)
```

---

## 🌟 Key Features

* **🌱 Explainable Regenerative Advisory**: Transparent agronomic rules for crop suitability, biological nitrogen fixation, and organic soil enhancement with confidence scores.
* **🔬 Multi-Modal Disease Diagnosis**: Upload leaf images to receive structured JSON diagnosis with organic-first treatments and confidence threshold gates.
* **🗣️ Smallholder Speech Synthesis**: One-click audio readout (TTS) of recommendations in Punjabi, Hindi, English, and Portuguese.
* **🌍 Config-Driven Country Profiles**: Instant multi-country scaling for India (`IN.json`), Brazil (`BR.json`), and South Africa (`ZA.json`).
* **🔒 Privacy by Design**: Zero raw farmer data transmission across borders; only aggregated insights and model metadata are federated.
* **⚡ Live Interactive Roadmap**: Built-in progress tracking and API simulator on `implementation.html`.

---

## 📂 Repository Structure

```
ByteForce/
├── backend/                  # Secure SQLite database manager & backend utilities
│   └── database.py
├── country_profiles/         # Multi-country JSON profile configurations
│   ├── IN.json               # India (Punjab, ICAR defaults, Punjabi/Hindi)
│   ├── BR.json               # Brazil (Cerrado, Embrapa defaults, Portuguese)
│   └── ZA.json               # South Africa (KZN, ARC defaults, isiZulu/English)
├── docs/                     # Technical documentation & DPG compliance
│   ├── architecture.md       # Target system & multi-node architecture
│   ├── privacy-and-governance.md # Zero raw-data policy & security guardrails
│   ├── validation.md         # EcoCrop & ICAR agronomic benchmark testing
│   ├── onboarding-a-new-country.md # 30-minute guide to deploy a sovereign node
│   └── pitch-script.md       # 5-minute timed presentation script & judge Q&A
├── tools/legacy/             # Archived utility & patch scripts
├── assets/                   # Static logos, icons, and media
├── app.py                    # Core Flask Advisory API & Node Gateway
├── implementation.html       # Track 4 Interactive Roadmap & API Simulator
├── implementation.js         # Tracker logic & Web Speech TTS engine
├── implementation.css        # Roadmap & Sandbox styles
├── index.html                # Main web portal
├── crop_id.html              # AI Crop Doctor
├── prices.html               # Mandi & market prices
├── style.css                 # Global theme & typography
├── requirements.txt          # Python dependencies
├── .env.example              # Environment variables template
├── LICENSE                   # Apache-2.0 License
├── CONTRIBUTING.md           # Contribution guidelines
└── CODE_OF_CONDUCT.md        # Community code of conduct
```

---

## 📥 Getting Started

### Prerequisites
* Python 3.9+
* Google Gemini API Key (optional for basic rules; required for multi-modal vision)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sachin24sk26/Karsakah.git
   cd Karsakah
   ```

2. **Set up Virtual Environment**
   ```bash
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # macOS / Linux
   source .venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env and insert your GEMINI_API_KEY
   ```

5. **Start the API & Web Server**
   ```bash
   python app.py
   ```
   Open `http://localhost:5000` or open `index.html` / `implementation.html` in your web browser.

---

## 📜 License & Governance

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.

---

## 👥 Contributors

* **Sachin**
* **Harshit**

<div align="center">
  <p>© 2026 KARSAKAH Initiative &bull; Digital Public Good for Agriculture</p>
</div>
