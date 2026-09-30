# Onboarding a New Country Node to KARSAKAH 🌍

This guide explains how any government agency, agricultural extension ministry, or cooperative can deploy a localized KARSAKAH node in **under 30 minutes**.

---

## ⚡ 4-Step Onboarding Workflow

### Step 1: Create the Country Profile JSON
Create a new file in `/country_profiles/{COUNTRY_CODE}.json` using your ISO 3166-1 alpha-2 code (e.g., `EG.json` for Egypt, `ET.json` for Ethiopia, `ID.json` for Indonesia).

```json
{
  "country": "EG",
  "country_name": "Egypt",
  "node_id": "node-eg-nile-01",
  "languages": ["ar", "en"],
  "default_language": "ar",
  "units": {
    "area": "feddan",
    "currency": "EGP",
    "yield": "ardeb/feddan"
  },
  "major_crops": [
    { "id": "faba_bean", "name": "Faba Bean (Broad Bean)", "family": "Fabaceae (Legume)", "nitrogen_fixing": true },
    { "id": "wheat", "name": "Wheat", "family": "Poaceae (Cereal)", "nitrogen_fixing": false },
    { "id": "cotton", "name": "Egyptian Long-Staple Cotton", "family": "Malvaceae (Fiber)", "nitrogen_fixing": false }
  ],
  "seasons": {
    "winter": { "start_month": 10, "end_month": 4, "type": "Winter Crop" },
    "summer": { "start_month": 5, "end_month": 9, "type": "Summer Crop" }
  },
  "data_sources": {
    "weather": "open-meteo",
    "soil": "soilgrids",
    "vegetation": "sentinel-2-stac"
  },
  "soil_defaults": {
    "ph_min": 7.5,
    "ph_max": 8.4,
    "target_organic_carbon_g_kg": 8.0
  },
  "advisory_rules_version": "2.4-agro",
  "extension_contacts": {
    "general": "Ministry of Agriculture and Land Reclamation (MALR)",
    "emergency": "Agricultural Research Center (ARC) Helpline"
  }
}
```

---

### Step 2: Configure Regional Crop Benchmarks
Ensure the regional crops in your profile match the agronomic criteria in `backend/rules_engine.py` (optimal pH, temperature range, and water need in mm).

---

### Step 3: Register Node with the Federated Network
Start your local backend server with:
```bash
export COUNTRY_NODE=EG
python app.py
```
Verify the OpenAPI node contract:
```bash
curl http://localhost:5000/v1/node/info?country=EG
```

---

### Step 4: Validate Data & Voice Readout
1. Open `implementation.html` or `index.html`.
2. Select your country node in the dropdown.
3. Verify that recommendations, local units, and voice TTS output accurately reflect your country's agricultural context.
