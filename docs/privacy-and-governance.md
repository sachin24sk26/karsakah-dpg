# Privacy, Data Governance & DPG Principles

## 1. Digital Public Goods (DPG) Alignment

KARSAKAH is committed to the **Digital Public Goods Standard** set by the Digital Public Goods Alliance (DPGA):
- **Open Source License**: Licensed under the Apache-2.0 License.
- **Open Data & Standards**: Adheres to OpenAPI 3.0 REST specifications, ISO 3166 country profiling, and GeoJSON open standards.
- **Do No Harm**: AI outputs are strictly governed by agronomic confidence gates and organic-first treatment preferences.

---

## 2. Zero-Raw-Data Privacy Architecture

Smallholder farmer data sovereignty is paramount:
1. **Local Node Isolation**: Personal identifying information (name, contact details, farm location) is stored solely on local node instances and encrypted with cryptographic salts.
2. **Aggregated Insight Sharing**: When nodes communicate across borders (e.g. India &rarr; Brazil &rarr; South Africa), they exchange only:
   - High-level anonymized disease occurrence counts.
   - Aggregate weather anomaly trends.
   - Agronomic rule version metrics.
3. **No Centralized Farmer Tracking**: No cross-border database retains individual farmer identities or satellite boundary footprints.

---

## 3. Right to Forget & Data Erasure
Farmers can request immediate deletion of their local profile and interaction logs directly through the user settings dashboard.

---

## 4. Technical Precision Note on "Federation"
- **Not Distributed Machine Learning**: KARSAKAH does **not** perform distributed weight-gradient aggregation (such as Federated Learning / FedAvg).
- **Federated Node Architecture**: Each sovereign nation operates its own independent backend node governed by domestic institutions.
- **What is Exchanged**: Strictly aggregated risk indicator cards (e.g. regional humidity spikes, spore migration alerts) and standardized Model Cards.
- **Protocol Simulation**: The cross-border exchange showcased on `network.html` runs in an interactive simulation mode to demonstrate the multi-national communication protocol before real-world inter-governmental deployment.
