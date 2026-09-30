# Contributing to KARSAKAH 🌾

Thank you for your interest in contributing to **KARSAKAH**, an open-source, interoperable Digital Public Good (DPG) for regenerative agriculture and smallholder farmer resilience across BRICS+ and global communities.

## 🌟 Our Guiding Principles
1. **Digital Public Goods Standard**: All components must be open source, modular, non-proprietary, and privacy-preserving.
2. **Farmer-First & Explainable**: AI recommendations must never be black boxes; always provide agronomic reasons, organic-first options, and data freshness metrics.
3. **Interoperable & Multi-Country Ready**: New country extensions must be configurable via `/country_profiles/{ISO}.json` without hardcoding region logic in core engines.
4. **Sovereign Data Boundary (Zero Raw-Data Transfer)**: Sovereign nodes exchange strictly aggregated Model Cards and macro-level disease risk indicators—never personal farmer records, plot coordinates, or farm images.

---

## 🛠️ How to Contribute

### 1. Adding a New Country Profile
To add support for your country or region:
1. Copy an existing profile from `country_profiles/IN.json` or `country_profiles/BR.json`.
2. Name it with your ISO 3166-1 alpha-2 code: `country_profiles/{COUNTRY_CODE}.json`.
3. Fill in supported languages, currency units, regional crops, soil benchmarks, and local extension contacts.
4. Test using the `/v1/node/info` endpoint and the Implementation sandbox.

### 2. Enhancing Regenerative Rules
- Add agronomic suitability rules in `/backend/rules_engine.py` following FAO EcoCrop or national ICAR/Embrapa guidelines.
- Always validate outputs against test coordinates in `docs/validation.md`.

### 3. Reporting Issues & Security Bugs
- For security issues or sensitive data leaks, please email the core maintainers directly.
- For feature requests, bug reports, and translations, open an issue on GitHub using our standard template.

---

## 📜 Development Workflow
1. Fork the repo and create your branch: `git checkout -b feature/my-new-feature`
2. Ensure you never commit `.env`, SQLite databases, or personal data.
3. Verify tests and linting.
4. Submit a Pull Request describing the deliverable, data sources, and validation results.
