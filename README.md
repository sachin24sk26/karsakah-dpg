<div align="center">
  <h1>🌾 KARSAKAH (کاشتکار / किसान)</h1>
  <p><strong>DPG-Aligned Platform for Interoperable, Regenerative Agricultural Advisory</strong></p>
  <p><em>Track 4 Architecture &bull; BRICS Federated Node Network &bull; Smallholder Farmer Resilience</em></p>

  <p>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License: Apache-2.0"></a>
    <a href="docs/privacy-and-governance.md"><img src="https://img.shields.io/badge/DPG-DPG--Aligned-green.svg" alt="DPG Aligned"></a>
    <a href="https://github.com/sachin24sk26/karsakah-dpg/releases"><img src="https://img.shields.io/badge/Release-v1.0.0-blue.svg" alt="Release: v1.0.0"></a>
    <a href="openapi.yaml"><img src="https://img.shields.io/badge/OpenAPI-3.0.3-orange.svg" alt="OpenAPI 3.0"></a>
    <a href="country_profiles/"><img src="https://img.shields.io/badge/BRICS%2B%20Nodes-8%20Sovereign%20Profiles-purple.svg" alt="BRICS+ Nodes"></a>
    <img src="https://img.shields.io/badge/Python-3.10+-yellow.svg" alt="Python Version">
  </p>
</div>

---

## 📖 About The Project

**KARSAKAH** is an open-source, **DPG-aligned** agricultural intelligence platform built to empower smallholder farmers with **explainable, regenerative agronomic recommendations**, real-time weather risk alerts, multilingual speech interaction, and crop disease diagnosis.


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
 Sovereign Node Registry & Aggregated Alert Protocol (Zero Raw-Data Transfer · Simulation Mode)
   🇮🇳 India Node (Punjab / ICAR) · 🇧🇷 Brazil Node (Cerrado / Embrapa) · 🇿🇦 South Africa Node (KZN / ARC) · 🇨🇳 China · 🇷🇺 Russia · 🇪🇬 Egypt · 🇪🇹 Ethiopia · 🇦🇪 UAE
```

---

## 🌟 Key Features

* **🌱 Explainable Regenerative Advisory**: Transparent agronomic rules for crop suitability, biological nitrogen fixation, and organic soil enhancement with confidence scores.
* **🔬 Multi-Modal Disease Diagnosis**: Upload leaf images to receive structured JSON diagnosis with organic-first treatments and confidence threshold gates.
* **🗣️ Smallholder Speech Synthesis**: One-click audio readout (TTS) of recommendations in Punjabi, Hindi, English, and Portuguese.
* **🌍 Config-Driven Country Profiles**: Instant multi-country scaling for India (`IN.json`), Brazil (`BR.json`), South Africa (`ZA.json`), China, Russia, Egypt, Ethiopia, and UAE.
* **🔒 Sovereign Data Boundary**: Zero raw farmer data transmission across borders; only aggregated pathogen alerts and standardized Model Cards are exchanged (demonstrated in protocol simulation mode).
* **⚡ Live Interactive Roadmap**: Built-in progress tracking and API simulator on `implementation.html`.

---

## 📂 Repository Structure

```
karsakah-dpg/
├── backend/                  # Python agronomic engines & geospatial connectors
│   ├── connectors.py         # Open-Meteo, SoilGrids 250m, Sentinel-2/1 SAR radar fusion
│   ├── rules_engine.py       # Explainable crop suitability & soil health scoring
│   ├── federation.py         # BRICS sovereign node protocol & aggregated alert exchange
│   └── database.py           # Sovereign SQLite node database manager
├── country_profiles/         # Sovereign country JSON profiles (8 BRICS+ nodes)
│   ├── IN.json               # India (Punjab / ICAR agronomics)
│   ├── BR.json               # Brazil (Cerrado / Embrapa agronomics)
│   ├── ZA.json               # South Africa (KZN / ARC agronomics)
│   ├── CN.json               # China (Huang-Huai-Hai plain agronomics)
│   ├── RU.json               # Russia (Black Soil / Chernozem agronomics)
│   ├── EG.json               # Egypt (Nile Delta agronomics)
│   ├── ET.json               # Ethiopia (Highlands agronomics)
│   └── AE.json               # UAE (Arid & Biosaline agronomics)
├── docs/                     # Technical documentation & DPG compliance
│   ├── architecture.md       # Target system & multi-node architecture
│   ├── privacy-and-governance.md # Zero raw-data policy & DPG alignment
│   ├── validation.md         # PlantVillage Gemini benchmark & ICAR testing
│   ├── onboarding-a-new-country.md # 30-minute guide to deploy a sovereign node
│   └── pitch-script.md       # 5-minute timed presentation script & judge Q&A
├── assets/                   # Static logos, icons, and media
├── app.py                    # Flask API Gateway & sovereign node endpoints
├── advisory.html / .js       # Track 4 Core: Smart Regenerative Field Advisory & TTS
├── crop_id.html / .js        # Track 4 Core: Multi-Modal AI Crop Doctor & Organic Bias
├── network.html / .js        # Track 4 Core: BRICS Sovereign Federated Protocol Hub
├── implementation.html / .js # Track 4 Interactive Roadmap & API Simulator
├── index.html                # Main web portal (reordered with Core Track 4 priority)
├── openapi.yaml              # OpenAPI 3.0.3 machine-readable contract
├── requirements.txt          # Python dependencies
├── .env.example              # Environment variables template
├── LICENSE                   # Apache-2.0 License
├── CONTRIBUTING.md           # Contribution guidelines
└── CODE_OF_CONDUCT.md        # Community code of conduct
```

---

## 📊 Language Breakdown & Tech Stack

| Component | Primary Languages / Tech | Role in KARSAKAH |
| :--- | :--- | :--- |
| **Frontend Web App** | JavaScript (ES6+), Vanilla CSS3, Semantic HTML5 | Responsive, mobile-first smallholder UI, Web Speech API TTS, canvas image compression (95% 2G/3G saving) |
| **Agronomic Engines** | Python 3.10+ (Flask, NumPy, Requests) | SoilGrids 250m & Open-Meteo connectors, Sentinel-2/1 SAR radar fusion, explainable rules engine |
| **Vision Diagnostics** | Google Gemini Vision (`gemini-2.5-flash`) | Structured JSON disease diagnosis with organic-first treatment prioritization & <0.60 safety gate |
| **Sovereign Profiles** | JSON (`/country_profiles/{ISO}.json`) | Config-driven localization for 8 BRICS+ nodes (crops, soil thresholds, currency, languages) |
| **API Contract** | OpenAPI 3.0.3 (YAML) | Standardized machine-readable DPG interoperability contract |

---

## 📥 Getting Started

### Prerequisites
* Python 3.9+
* Google Gemini API Key (optional for basic rules; required for multi-modal vision)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sachin24sk26/karsakah-dpg.git
   cd karsakah-dpg
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
