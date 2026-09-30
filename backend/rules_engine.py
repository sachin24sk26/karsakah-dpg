"""
Regenerative Advisory Rules Engine for KARSAKAH (Track 4)
Transparent, explainable agronomic rules based on FAO EcoCrop and ICAR/Embrapa guidelines.
Computes crop suitability, biological nitrogen fixation, soil health practices,
water efficiency timing, and data-backed confidence scores.
"""

import json
from typing import Dict, Any, List

# Crop Agronomic Database (EcoCrop & Regional Extension Standards)
CROP_DATABASE = {
    "moong": {
        "name": "Moong (Green Gram / Vigna radiata)",
        "family": "Fabaceae (Legume)",
        "type": "Pulse / Legume",
        "nitrogen_fixing": True,
        "optimal_ph": (6.2, 7.8),
        "tolerable_ph": (5.5, 8.5),
        "optimal_temp_c": (25, 35),
        "water_need_mm_season": 350,
        "drought_tolerance": "High",
        "soil_textures": ["sandy loam", "loam", "clay loam"],
        "min_organic_carbon": 5.0,
        "practices": [
            "Retain cereal crop residue/stubble as surface mulch to conserve moisture.",
            "Seed inoculation with Rhizobium leguminosarum bio-fertilizer to replace synthetic urea.",
            "Zero-tillage direct seeding into stubble to preserve soil microbial biodiversity."
        ]
    },
    "chickpea": {
        "name": "Chickpea / Bengal Gram (Cicer arietinum)",
        "family": "Fabaceae (Legume)",
        "type": "Pulse / Legume",
        "nitrogen_fixing": True,
        "optimal_ph": (6.0, 7.5),
        "tolerable_ph": (5.5, 8.5),
        "optimal_temp_c": (18, 28),
        "water_need_mm_season": 300,
        "drought_tolerance": "High",
        "soil_textures": ["sandy loam", "loam", "clay loam"],
        "min_organic_carbon": 5.0,
        "practices": [
            "Incorporate Trichoderma viride bio-agent during seed treatment to prevent root rot.",
            "Intercrop with mustard (4:1 row ratio) for natural pest deterrence and root niche separation.",
            "Avoid excessive synthetic nitrogen to encourage deep root nodulation."
        ]
    },
    "cowpea": {
        "name": "Cowpea (Vigna unguiculata)",
        "family": "Fabaceae (Legume)",
        "type": "Pulse / Cover / Forage",
        "nitrogen_fixing": True,
        "optimal_ph": (5.5, 7.5),
        "tolerable_ph": (5.0, 8.0),
        "optimal_temp_c": (22, 34),
        "water_need_mm_season": 300,
        "drought_tolerance": "Very High",
        "soil_textures": ["sandy loam", "loam", "sandy clay", "clay loam"],
        "min_organic_carbon": 4.5,
        "practices": [
            "Grow as a high-density green cover crop during fallow periods to smother weeds.",
            "Mulch standing biomass before main cereal sowing to deposit 40-60 kg N/ha into soil.",
            "Plant in micro-basins (Zai pit technique) to harvest seasonal precipitation."
        ]
    },
    "soybean": {
        "name": "Soybean (Glycine max)",
        "family": "Fabaceae (Legume)",
        "type": "Oilseed / Legume",
        "nitrogen_fixing": True,
        "optimal_ph": (5.8, 7.0),
        "tolerable_ph": (5.2, 7.8),
        "optimal_temp_c": (20, 32),
        "water_need_mm_season": 500,
        "drought_tolerance": "Medium",
        "soil_textures": ["clay loam", "loam", "sandy loam"],
        "min_organic_carbon": 7.0,
        "practices": [
            "Direct planting into crop residue (Plantio Direto) without soil inversion.",
            "Dual biological co-inoculation with Bradyrhizobium and Azospirillum brasilense.",
            "Maintain permanent straw cover to buffer high soil surface temperatures."
        ]
    },
    "wheat": {
        "name": "Wheat (Triticum aestivum)",
        "family": "Poaceae (Cereal)",
        "type": "Cereal",
        "nitrogen_fixing": False,
        "optimal_ph": (6.0, 7.5),
        "tolerable_ph": (5.5, 8.2),
        "optimal_temp_c": (15, 25),
        "water_need_mm_season": 450,
        "drought_tolerance": "Medium",
        "soil_textures": ["loam", "clay loam", "sandy loam"],
        "min_organic_carbon": 6.0,
        "practices": [
            "Happy Seeder / Smart Seeder direct sowing into standing rice straw.",
            "Apply zinc solubilizing bacteria (ZSB) alongside organic vermicompost.",
            "Irrigate based on Crown Root Initiation (CRI) stage only if weather forecast is dry."
        ]
    },
    "sorghum": {
        "name": "Sorghum / Jowar (Sorghum bicolor)",
        "family": "Poaceae (Cereal)",
        "type": "Millets / Cereal",
        "nitrogen_fixing": False,
        "optimal_ph": (5.5, 8.0),
        "tolerable_ph": (5.0, 8.5),
        "optimal_temp_c": (24, 35),
        "water_need_mm_season": 400,
        "drought_tolerance": "Very High",
        "soil_textures": ["sandy loam", "loam", "clay loam", "sandy clay"],
        "min_organic_carbon": 4.5,
        "practices": [
            "Minimum tillage combined with intercropped cowpea or pigeonpea.",
            "Deep root penetration breaks soil compaction layers naturally.",
            "Incorporate crop stalks back into the soil post-harvest to cycle potash."
        ]
    },
    "mustard": {
        "name": "Mustard / Rapeseed (Brassica juncea)",
        "family": "Brassicaceae (Oilseed)",
        "type": "Oilseed",
        "nitrogen_fixing": False,
        "optimal_ph": (6.0, 7.5),
        "tolerable_ph": (5.5, 8.2),
        "optimal_temp_c": (15, 25),
        "water_need_mm_season": 250,
        "drought_tolerance": "High",
        "soil_textures": ["sandy loam", "loam", "clay loam"],
        "min_organic_carbon": 5.0,
        "practices": [
            "Bio-fumigation: residual glucosinolates naturally suppress soil nematodes.",
            "Requires only 1-2 light supplemental irrigations when preceded by mulching."
        ]
    }
}

def evaluate_crop_suitability(crop_id: str, crop_info: dict, soil: dict, weather: dict, previous_crop: str = "", vegetation: dict = None) -> Dict[str, Any]:
    """Score individual crop suitability and gather explainability reasons including satellite NDVI."""
    reasons = []
    practices = list(crop_info.get("practices", []))
    score = 1.0

    ph = soil.get("ph", 7.0)
    opt_ph = crop_info["optimal_ph"]
    tol_ph = crop_info["tolerable_ph"]

    # 1. Soil pH Matching
    if opt_ph[0] <= ph <= opt_ph[1]:
        reasons.append(f"Soil pH {ph} is within the optimal range ({opt_ph[0]} – {opt_ph[1]}).")
    elif tol_ph[0] <= ph <= tol_ph[1]:
        score -= 0.15
        reasons.append(f"Soil pH {ph} is tolerable, but optimal range is {opt_ph[0]} – {opt_ph[1]}.")
    else:
        score -= 0.45
        reasons.append(f"Soil pH {ph} is suboptimal for {crop_info['name']}.")

    # 2. Temperature Matching
    avg_temp = weather.get("avg_temp_c", 26.0)
    opt_temp = crop_info["optimal_temp_c"]
    if opt_temp[0] <= avg_temp <= opt_temp[1]:
        reasons.append(f"Forecast temperature ({avg_temp}°C) matches thermal requirements ({opt_temp[0]}–{opt_temp[1]}°C).")
    else:
        score -= 0.20
        reasons.append(f"Current ambient temperature ({avg_temp}°C) deviates from optimal ({opt_temp[0]}–{opt_temp[1]}°C).")

    # 3. Soil Texture Compatibility
    texture = soil.get("texture", "loam").lower()
    if texture in crop_info["soil_textures"]:
        reasons.append(f"Soil texture ({texture}) provides good aeration and root penetration.")
    else:
        score -= 0.10

    # 4. Crop Rotation & Legume Nitrogen Restoration Bonus
    prev_lower = (previous_crop or "").lower()
    if prev_lower in ["wheat", "rice", "maize", "cereal", "sugarcane"]:
        if crop_info.get("nitrogen_fixing"):
            score += 0.15
            reasons.append(f"Rotating a legume after cereal ({previous_crop}) restores natural nitrogen and disrupts pest cycles.")
        elif crop_info["family"] in ["Poaceae (Cereal)"]:
            score -= 0.25
            reasons.append(f"Repeating cereal after cereal ({previous_crop}) depletes nitrogen and encourages soil-borne pests.")

    # 5. Soil Organic Carbon Analysis
    soc = soil.get("organic_carbon_g_kg", 6.0)
    if soc < 7.0:
        practices.append(f"Soil Organic Carbon ({soc} g/kg) is low; apply 2 tons/acre compost or green manure to boost soil sponge.")
    else:
        reasons.append(f"Healthy soil organic carbon ({soc} g/kg) enhances nutrient bioavailability.")

    # 6. Satellite Vegetation & Canopy Vigor Integration (Copernicus Sentinel-2 & Sentinel-1 SAR)
    if vegetation:
        ndvi = vegetation.get("ndvi", 0.55)
        canopy_vigor = vegetation.get("canopy_vigor", "Moderate Vegetative")
        cloud_blocked = vegetation.get("cloud_blocked", False)
        cloud_cover = vegetation.get("cloud_cover_pct", 18)

        if ndvi < 0.42:
            # Low canopy vigor or bare post-harvest land
            if crop_info.get("type") in ["Pulse / Legume", "Pulse / Cover / Forage"]:
                score += 0.10
                reasons.append(f"Satellite NDVI ({ndvi} · {canopy_vigor}) shows sparse ground cover; quick-canopy legume rotation protects topsoil from heat desiccation.")
        elif ndvi >= 0.70:
            reasons.append(f"Satellite NDVI ({ndvi} · {canopy_vigor}) confirms dense surface vegetative biomass; retain residue as surface mulch.")

        if cloud_blocked:
            practices.append(f"Satellite Protocol Notice: Optical pass obscured by {cloud_cover}% clouds; surface verified via Sentinel-1 SAR radar backscatter.")

    # Final bounded score
    final_score = round(max(0.1, min(0.98, score)), 2)

    return {
        "crop_id": crop_id,
        "crop_name": crop_info["name"],
        "type": crop_info["type"],
        "suitability_score": final_score,
        "why": reasons,
        "regenerative_practices": practices
    }

def generate_water_and_risk_plan(weather: dict, soil: dict, vegetation: dict = None) -> Dict[str, Any]:
    """Generate dynamic water efficiency guidance and risk alerts from 7-day forecast and satellite observations."""
    rain_sum = weather.get("rain_sum_mm_7d", 0.0)
    max_rain = weather.get("max_rain_day_mm", 0.0)
    max_prob = weather.get("max_rain_probability_pct", 0)
    et0_avg = weather.get("et0_fao_mm_daily_avg", 4.0)

    risks = []
    water_plan = ""

    # Rain & Irrigation Timing
    if rain_sum >= 20.0 or max_prob >= 50:
        water_plan = f"Rain forecast ({rain_sum} mm in 7 days, max probability {max_prob}%). Delay all irrigation for 48–72 hours to save groundwater and prevent waterlogging."
    elif rain_sum < 5.0 and et0_avg > 4.5:
        water_plan = f"High atmospheric evapotranspiration ({et0_avg} mm/day) with negligible rain. Apply light evening drip irrigation or maintain mulch layer to reduce evaporative loss."
    else:
        water_plan = f"Moderate water conditions. Soil moisture is adequate; schedule light irrigation only if top 5 cm soil feels dry."

    # Satellite vegetation risk context
    if vegetation:
        ndvi = vegetation.get("ndvi", 0.55)
        if ndvi < 0.35 and rain_sum < 5.0:
            risks.append(f"Satellite vegetation stress alert: Low canopy NDVI ({ndvi}) combined with low precipitation. Urgent soil mulching advised.")
        if vegetation.get("cloud_blocked"):
            risks.append(f"Observation Notice: Sentinel-2 pass obscured by {vegetation.get('cloud_cover_pct')}% cloud cover. Switched automatically to Sentinel-1 SAR Radar soil backscatter.")

    # Weather Risk alerts
    if max_rain >= 30.0:
        risks.append(f"Heavy rain alert ({max_rain} mm in 24h expected). Ensure clear drainage channels and delay topdressing fertilizers to avoid nutrient runoff.")
    if weather.get("temp_max_c", 30.0) >= 38.0:
        risks.append("Extreme heat wave alert (>38°C). Keep organic straw mulch on soil to reduce root-zone temperature spikes by up to 4°C.")
    if weather.get("humidity_pct", 50) >= 80 and weather.get("avg_temp_c", 25) >= 24:
        risks.append("High humidity and warm temperatures create elevated fungal pathogen risk. Scout lower leaves regularly for early blight/rust symptoms.")

    if not risks:
        risks.append("No immediate severe weather risks detected for the upcoming 7-day window.")

    return {
        "water_efficiency_plan": water_plan,
        "risk_alerts": risks
    }

def generate_advisory(data_bundle: Dict[str, Any], previous_crop: str = "wheat", farmer_goal: str = "regenerative") -> Dict[str, Any]:
    """
    Main entry point for generating explainable, regenerative crop and soil recommendations.
    Integrates weather, soil chemistry, and Sentinel-2 satellite vegetation layers.
    """
    weather = data_bundle.get("weather", {})
    soil = data_bundle.get("soil", {})
    vegetation = data_bundle.get("vegetation", {})
    provenance = data_bundle.get("data_provenance", {})
    confidence_val = provenance.get("composite_confidence", 0.85)

    # Classify confidence level
    if confidence_val >= 0.80:
        confidence_label = f"High ({confidence_val})"
    elif confidence_val >= 0.60:
        confidence_label = f"Medium ({confidence_val}) - Consider local soil test"
    else:
        confidence_label = f"Low ({confidence_val}) - Based on regional defaults"

    # Evaluate all candidate crops with satellite vegetation feed
    evaluated_crops = []
    for crop_id, crop_info in CROP_DATABASE.items():
        eval_res = evaluate_crop_suitability(crop_id, crop_info, soil, weather, previous_crop, vegetation)
        evaluated_crops.append(eval_res)

    # Sort crops by suitability score descending
    evaluated_crops.sort(key=lambda x: x["suitability_score"], reverse=True)
    top_recommendations = evaluated_crops[:3]

    # Water & risk plan with satellite NDVI context
    water_risk = generate_water_and_risk_plan(weather, soil, vegetation)

    # Voice scripts for smallholder TTS
    primary_crop = top_recommendations[0]["crop_name"]
    voice_script_en = (
        f"Top recommended crop is {primary_crop} with suitability score of {int(top_recommendations[0]['suitability_score']*100)} percent. "
        f"{water_risk['water_efficiency_plan']} "
        f"Key regenerative practice: {top_recommendations[0]['regenerative_practices'][0]}"
    )

    return {
        "status": "success",
        "confidence": confidence_label,
        "confidence_score": confidence_val,
        "primary_recommendation": top_recommendations[0],
        "alternative_recommendations": top_recommendations[1:],
        "water_efficiency_plan": water_risk["water_efficiency_plan"],
        "risk_alerts": water_risk["risk_alerts"],
        "vegetation": vegetation,
        "data_provenance": provenance,
        "voice_summary": {
            "en": voice_script_en,
            "pa": f"ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀ ਫ਼ਸਲ {primary_crop} ਹੈ। {water_risk['water_efficiency_plan']}",
            "hi": f"अनुशंसित फसल {primary_crop} है। {water_risk['water_efficiency_plan']}",
            "pt": f"A cultura recomendada é {primary_crop}. {water_risk['water_efficiency_plan']}"
        }
    }

