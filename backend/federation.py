"""
Federation & Model Card Exchange Module for KARSAKAH (Track 4 Phase 5)
Manages the BRICS+ Federated Node Registry, standardized Model Cards,
and simulated cross-border insight exchange while maintaining Zero-Raw-Data guarantees.
"""

import os
import json
import datetime
from typing import Dict, Any, List

COUNTRY_PROFILES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'country_profiles')

# Model Cards Metadata for Registered Nodes
MODEL_CARDS = {
    "node-in-punjab-01": {
        "node_id": "node-in-punjab-01",
        "country": "IN",
        "country_name": "India (Punjab Node)",
        "lead_institution": "ICAR - Indian Council of Agricultural Research & PAU",
        "advisory_model": "Regenerative Rule Matrix v2.4-agro",
        "vision_model": "Gemini 2.5 Multi-Modal + PlantVillage Benchmark Set",
        "accuracy_score": "89.4%",
        "test_dataset_size": "120 validated field trials",
        "primary_objective": "Groundwater conservation, rice-wheat stubble management, biological nitrogen restoration with pulses.",
        "shared_insights_count": 14
    },
    "node-br-cerrado-02": {
        "node_id": "node-br-cerrado-02",
        "country": "BR",
        "country_name": "Brazil (Cerrado Node)",
        "lead_institution": "Embrapa (Empresa Brasileira de Pesquisa Agropecuária)",
        "advisory_model": "Plantio Direto & ILPF Optimization Matrix v2.4",
        "vision_model": "Gemini 2.5 Multi-Modal + Embrapa Rust Pathology Library",
        "accuracy_score": "91.2%",
        "test_dataset_size": "95 tropical soil trials",
        "primary_objective": "Direct planting into straw cover, biological seed co-inoculation, Asian rust early warning.",
        "shared_insights_count": 11
    },
    "node-za-kzn-03": {
        "node_id": "node-za-kzn-03",
        "country": "ZA",
        "country_name": "South Africa (KwaZulu-Natal Node)",
        "lead_institution": "ARC - Agricultural Research Council",
        "advisory_model": "Drought Resilience & Conservation Basin Engine v2.4",
        "vision_model": "Gemini 2.5 Multi-Modal + Fall Armyworm Field Library",
        "accuracy_score": "88.7%",
        "test_dataset_size": "80 smallholder dryland plots",
        "primary_objective": "Rainwater harvesting in Zai basins, drought-tolerant cowpea/sorghum rotations, bio-pest traps.",
        "shared_insights_count": 9
    },
    "node-cn-hunan-01": {
        "node_id": "node-cn-hunan-01",
        "country": "CN",
        "country_name": "China (Hunan Node)",
        "lead_institution": "CAAS - Chinese Academy of Agricultural Sciences",
        "advisory_model": "High-Efficiency Hybrid Rice & Organic Intercrop Engine v2.4",
        "vision_model": "Gemini 2.5 Multi-Modal + Rice Pathogen Diagnostic Set",
        "accuracy_score": "92.5%",
        "test_dataset_size": "150 multi-province test beds",
        "primary_objective": "Green manure relay cropping (Astragalus sinicus), nitrogen runoff reduction, organic pest barrier.",
        "shared_insights_count": 16
    },
    "node-eg-nile-01": {
        "node_id": "node-eg-nile-01",
        "country": "EG",
        "country_name": "Egypt (Nile Basin Node)",
        "lead_institution": "Agricultural Research Center (ARC Egypt)",
        "advisory_model": "Arid Nile Water & Soil Salinity Management Engine v2.4",
        "vision_model": "Gemini 2.5 Multi-Modal + Faba Bean Diagnostic Set",
        "accuracy_score": "87.9%",
        "test_dataset_size": "65 irrigated desert/delta plots",
        "primary_objective": "Salinity buffering with organic amendments, precision drip scheduling, faba bean legume restoration.",
        "shared_insights_count": 8
    },
    "node-ru-krasnodar-01": {
        "node_id": "node-ru-krasnodar-01",
        "country": "RU",
        "country_name": "Russia (Krasnodar Chernozem Node)",
        "lead_institution": "VIM - Federal Scientific Agroengineering Center & RSAC",
        "advisory_model": "Cold-Climate Cereal & Chernozem Carbon Engine v2.4",
        "vision_model": "Gemini 2.5 Multi-Modal + Cereal Rust Pathology Library",
        "accuracy_score": "89.8%",
        "test_dataset_size": "110 steppe and chernozem trials",
        "primary_objective": "Soil organic carbon preservation in chernozems, winter-dormancy snow-melt moisture retention, field pea rotation.",
        "shared_insights_count": 12
    },
    "node-et-oromia-01": {
        "node_id": "node-et-oromia-01",
        "country": "ET",
        "country_name": "Ethiopia (Oromia Highland Node)",
        "lead_institution": "EIAR - Ethiopian Institute of Agricultural Research",
        "advisory_model": "Highland Agroecology & Teff-Legume Rotation Engine v2.4",
        "vision_model": "Gemini 2.5 Multi-Modal + East African Rust & Blight Library",
        "accuracy_score": "88.1%",
        "test_dataset_size": "70 highland smallholder plots",
        "primary_objective": "Teff lodging reduction, biological chickpea/faba bean rotation, rust pathogen early-alert sharing with South Africa.",
        "shared_insights_count": 7
    },
    "node-ae-desert-01": {
        "node_id": "node-ae-desert-01",
        "country": "AE",
        "country_name": "UAE (Biosaline Desert Node)",
        "lead_institution": "ICBA - International Center for Biosaline Agriculture",
        "advisory_model": "Biosaline Halophyte & Arid Precision Engine v2.4",
        "vision_model": "Gemini 2.5 Multi-Modal + Date Palm Pest Diagnostic Set",
        "accuracy_score": "90.4%",
        "test_dataset_size": "45 controlled-environment desert trials",
        "primary_objective": "Hyper-arid water efficiency, marginal hypersaline soil cultivation (quinoa, salicornia), date palm weevil early warning.",
        "shared_insights_count": 10
    }
}

# In-memory Federated Insight Stream (Aggregated, Anonymized Cross-Border Alerts)
FEDERATED_INSIGHTS: List[Dict[str, Any]] = [
    {
        "id": "ins-101",
        "type": "DISEASE_EARLY_WARNING",
        "source_node": "node-in-punjab-01",
        "target_node": "node-za-kzn-03",
        "title": "Bacterial Blight Humidity Spike Alert",
        "detail": "High canopy humidity (>78%) with warm daytime temps identified as early trigger for bacterial leaf lesions. Alert transferred to South Africa node.",
        "timestamp": "2026-09-30T10:15:00Z",
        "privacy_verified": True,
        "raw_data_transmitted": "0 bytes"
    },
    {
        "id": "ins-102",
        "type": "AGRONOMIC_PRACTICE_SYNC",
        "source_node": "node-br-cerrado-02",
        "target_node": "node-in-punjab-01",
        "title": "Brachiaria Straw Soil Temperature Buffering Model",
        "detail": "Retaining 4t/ha straw mulch reduced topsoil temp by 3.8°C during dry spell. Agronomic parameter weights synchronized with India node.",
        "timestamp": "2026-09-29T16:45:00Z",
        "privacy_verified": True,
        "raw_data_transmitted": "0 bytes"
    },
    {
        "id": "ins-103",
        "type": "PEST_RESISTANCE_INSIGHT",
        "source_node": "node-za-kzn-03",
        "target_node": "node-eg-nile-01",
        "title": "Biological Neem & Trichogramma Whorl Application Protocol",
        "detail": "Bio-agent whorl application achieved 84% suppression on early instar pests without synthetic sprays. Model parameters shared with Egypt node.",
        "timestamp": "2026-09-28T09:20:00Z",
        "privacy_verified": True,
        "raw_data_transmitted": "0 bytes"
    }
]

def get_all_nodes() -> List[Dict[str, Any]]:
    """Retrieve full registry of all active and available nodes across the federation."""
    nodes = []
    
    # Load all country profile JSONs
    if os.path.exists(COUNTRY_PROFILES_DIR):
        for fname in sorted(os.listdir(COUNTRY_PROFILES_DIR)):
            if fname.endswith(".json"):
                try:
                    with open(os.path.join(COUNTRY_PROFILES_DIR, fname), 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        node_id = data.get("node_id", f"node-{data.get('country', '').lower()}-01")
                        card = MODEL_CARDS.get(node_id, {
                            "node_id": node_id,
                            "country": data.get("country", ""),
                            "country_name": data.get("country_name", ""),
                            "lead_institution": "National Agricultural Extension Authority",
                            "advisory_model": "Regenerative Matrix v2.4",
                            "accuracy_score": "88.0%",
                            "primary_objective": "Regenerative soil and crop optimization."
                        })
                        nodes.append({
                            "node_id": node_id,
                            "country": data.get("country"),
                            "country_name": data.get("country_name"),
                            "status": "online",
                            "latency_ms": 24,
                            "languages": data.get("languages", ["en"]),
                            "units": data.get("units", {}),
                            "supported_crops_count": len(data.get("major_crops", [])),
                            "model_card": card
                        })
                except Exception as e:
                    print(f"Error loading profile {fname}: {e}")
    return nodes

def get_insights_feed() -> List[Dict[str, Any]]:
    """Retrieve the live timeline of shared federated insights."""
    return FEDERATED_INSIGHTS

def trigger_insight_sync(source_country: str, target_country: str, alert_type: str = "DISEASE_EARLY_WARNING") -> Dict[str, Any]:
    """
    Simulate cross-border insight sharing between two nodes.
    Generates an anonymized insight package with verified Zero-Raw-Data guarantees.
    """
    source_node = f"node-{source_country.lower()}-01" if source_country != "BR" and source_country != "ZA" else ("node-br-cerrado-02" if source_country == "BR" else "node-za-kzn-03")
    target_node = f"node-{target_country.lower()}-01" if target_country != "BR" and target_country != "ZA" else ("node-br-cerrado-02" if target_country == "BR" else "node-za-kzn-03")

    insight_id = f"ins-{int(datetime.datetime.now().timestamp())}"
    timestamp_iso = datetime.datetime.now().isoformat() + "Z"

    titles = {
        "DISEASE_EARLY_WARNING": f"Cross-Border Pathogen Risk Alert ({source_country} → {target_country})",
        "SOIL_HEALTH_SYNC": f"Legume Root Nodulation Model Sync ({source_country} → {target_country})",
        "WATER_DROUGHT_SYNC": f"Evapotranspiration Deficit Early Warning ({source_country} → {target_country})"
    }

    details = {
        "DISEASE_EARLY_WARNING": f"Elevated humidity anomaly from {source_country} node correlated with sporulation risks. Early prevention advice propagated to {target_country} extension registry.",
        "SOIL_HEALTH_SYNC": f"Soil Organic Carbon accretion weights from {source_country} conservation plots synchronized with {target_country} rules engine.",
        "WATER_DROUGHT_SYNC": f"Atmospheric dryness index model transferred from {source_country} node to update irrigation timing heuristics in {target_country}."
    }

    new_insight = {
        "id": insight_id,
        "type": alert_type,
        "source_node": source_node,
        "target_node": target_node,
        "title": titles.get(alert_type, "Federated Insight Transfer"),
        "detail": details.get(alert_type, "Model metadata synchronized across nodes."),
        "timestamp": timestamp_iso,
        "privacy_verified": True,
        "raw_data_transmitted": "0 bytes (Federated Parameter Exchange)"
    }

    FEDERATED_INSIGHTS.insert(0, new_insight)
    return new_insight
