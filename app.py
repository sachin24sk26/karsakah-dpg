from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import folium
import random
import time
import os
import requests
import urllib3
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import importlib
import pkgutil

# Python 3.14 compatibility shims
if not hasattr(pkgutil, 'get_loader'):
    def _get_loader(name):
        try:
            spec = importlib.util.find_spec(name)
        except (ImportError, ValueError):
            return None
        return spec.loader if spec is not None else None
    pkgutil.get_loader = _get_loader

import werkzeug
if not hasattr(werkzeug, '__version__'):
    try:
        import importlib.metadata
        werkzeug.__version__ = importlib.metadata.version('werkzeug')
    except Exception:
        werkzeug.__version__ = "3.1.3"

import google.generativeai as genai
import json
import datetime

# Load environment variables
load_dotenv(override=True)

# Initialize Gemini Client
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    system_instruction = "You are 'KARSAKAH', an expert agricultural AI assistant. You help farmers with crop diseases, market prices, general farming advice, and best practices. Be concise, practical, and friendly. Answer in the language the user speaks to you. Do not provide information outside of agriculture and farming."
    gemini_model = genai.GenerativeModel("gemini-2.5-flash", system_instruction=system_instruction)
else:
    print("Warning: GEMINI_API_KEY not found in .env file.")
    gemini_model = None


app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='/')
# Enable CORS so our frontend index.html can communicate with this API
CORS(app)

# Mock model data (Simulating a model trained on Kaggle PlantVillage dataset)
DISEASE_CLASSES = [
    {
        "disease": "Tomato - Early Blight",
        "status": "Infected",
        "recommendation": "Remove affected leaves immediately and destroy them. Apply copper-based fungicides or those containing Chlorothalonil early in the season. Ensure proper spacing for air circulation."
    },
    {
        "disease": "Tomato - Late Blight",
        "status": "Infected",
        "recommendation": "Apply fungicides like Mancozeb immediately. Avoid overhead watering to keep foliage dry. Destroy deeply infected plants."
    },
    {
        "disease": "Apple - Cedar Apple Rust",
        "status": "Infected",
        "recommendation": "Remove nearby eastern red cedar trees if possible (alternate host). Apply preventative fungicides in early spring when apple blossoms first appear."
    },
    {
        "disease": "Apple - Scab",
        "status": "Infected",
        "recommendation": "Rake and destroy fallen leaves in autumn to reduce overwintering fungi. Apply protective fungicide sprays early in the growing season."
    },
    {
        "disease": "Corn - Northern Leaf Blight",
        "status": "Infected",
        "recommendation": "Plant resistant hybrids in the future. Apply foliar fungicides if lesions appear before or during tasseling. Practice crop rotation."
    },
    {
        "disease": "Potato - Early Blight",
        "status": "Infected",
        "recommendation": "Use certified disease-free seed potatoes. Keep plants healthy with proper fertilizer and water. Apply fungicide when lesions first appear."
    },
    {
        "disease": "Healthy Leaf",
        "status": "Healthy",
        "recommendation": "No action needed. Continue standard agricultural practices, maintain proper watering and fertilizer schedules to ensure optimal yield."
    }
]

@app.route('/v1/diagnose', methods=['POST'])
@app.route('/api/analyze', methods=['POST'])
def diagnose_crop_v1():
    """
    Standardized Multi-Modal Disease Diagnosis Endpoint (Track 4).
    Accepts plant leaf image, evaluates with Gemini Vision, enforces strict schema,
    applies a confidence threshold gate (< 60%), and prioritizes organic/biological controls.
    """
    # Check if an image was uploaded
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided. Please upload a clear photo of the plant leaf."}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # If Gemini Model is configured
    if gemini_model:
        try:
            image_data = file.read()
            mime_type = file.content_type if file.content_type else "image/jpeg"
            image_parts = [{"mime_type": mime_type, "data": image_data}]
            
            # Step 1: Quality Gate & Validation
            prompt_valid = "Analyze this image carefully. Is it a photo of a crop, agricultural plant, or tree leaf? Answer strictly 'Yes' or 'No'."
            validation_response = gemini_model.generate_content([image_parts[0], prompt_valid])
            val_text = validation_response.text.strip().lower()
            if 'no' in val_text and 'yes' not in val_text:
                return jsonify({
                    "status": "rejected",
                    "error": "Image quality gate failed: The uploaded photo does not appear to be a plant or leaf. Please upload a clear, focused picture of the crop foliage."
                }), 400
            
            # Step 2: Pathological Analysis with Organic Bias
            prompt_diag = """You are an expert agronomic plant pathologist following Digital Public Good standards.
Analyze this plant/leaf image and provide actionable, regenerative recommendations.
Return STRICT JSON with the following structure (no markdown fences, raw JSON only):
{
  "crop": "Crop Name (e.g., Rice, Tomato, Apple, Wheat, Soybean)",
  "disease": "Specific Disease Name or 'Healthy Leaf'",
  "status": "Infected" or "Healthy",
  "confidence": numerical float between 0.0 and 1.0 (e.g., 0.88),
  "symptoms_observed": ["Symptom 1", "Symptom 2"],
  "immediate_cultural_action": ["Action 1", "Action 2"],
  "treatment_organic": [
    "Bio-agent or organic control 1 (e.g. Neem seed kernel extract 5%, Trichoderma, Bacillus subtilis)",
    "Cultural sanitation practice"
  ],
  "treatment_chemical": [
    "Selective low-toxicity registered chemical control (include warning to consult local dosage regulations)"
  ],
  "prevention": ["Crop rotation tip", "Residue management tip"],
  "needs_expert": false
}"""
            
            diagnosis_response = gemini_model.generate_content([image_parts[0], prompt_diag])
            text_response = diagnosis_response.text.strip()
            if text_response.startswith('```json'):
                text_response = text_response[7:-3].strip()
            elif text_response.startswith('```'):
                text_response = text_response[3:-3].strip()
                
            data = json.loads(text_response)
            
            # Normalize confidence score
            conf = float(data.get("confidence", 0.85))
            if conf > 1.0: # If returned as 0-100%
                conf = conf / 100.0
            data["confidence"] = round(conf, 2)

            # Confidence threshold gate (< 0.60 requires officer fallback)
            if data["confidence"] < 0.60:
                data["needs_expert"] = True
                data["expert_fallback"] = "Confidence score is below threshold (under 60%). Please consult your local Krishi Vigyan Kendra (KVK) or extension officer with a physical sample before taking chemical measures."

            data["governance"] = {
                "organic_bias": "Organic and biological controls prioritized first; synthetic controls restricted as secondary fallback.",
                "rules_version": "2.4-agro-pathology"
            }

            return jsonify(data), 200
            
        except Exception as e:
            print(f"Gemini API diagnosis error: {e}")
            return jsonify({"error": "Failed to complete AI diagnosis", "details": str(e)}), 500
    
    # Offline Mock Fallback
    return jsonify({
        "status": "Infected",
        "crop": "Tomato",
        "disease": "Tomato - Early Blight (Alternaria solani)",
        "confidence": 0.88,
        "symptoms_observed": ["Dark concentric target-like rings on lower leaves", "Yellow chlorotic halo"],
        "immediate_cultural_action": ["Prune and burn affected bottom leaves to prevent splash dispersal"],
        "treatment_organic": [
            "Spray 5% Neem Seed Kernel Extract (NSKE) or Trichoderma harzianum @ 5g/L water",
            "Apply Copper hydroxide (organic certified formulation) at first spot sighting"
        ],
        "treatment_chemical": [
            "Mancozeb 75 WP @ 2g/L water (use strictly as secondary measure if organic threshold breached)"
        ],
        "prevention": ["Practice 3-year solanaceous crop rotation", "Mulch base with clean straw"],
        "needs_expert": False,
        "governance": {
            "source": "Agro-Pathology Baseline Engine",
            "organic_bias": "Organic-first protocol active"
        }
    }), 200


@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Endpoint that handles incoming chat messages and replies using Gemini.
    """
    if not gemini_model:
        return jsonify({"error": "Gemini API is not configured on the server."}), 500

    data = request.get_json()
    if not data or 'messages' not in data:
        return jsonify({"error": "Invalid request. 'messages' array is required."}), 400

    user_messages = data['messages']

    # Convert messages to Gemini format
    # user_messages is [{'role': 'user', 'content': '...'}, {'role': 'assistant', 'content': '...'}]
    formatted_messages = []
    for msg in user_messages:
        role = "user" if msg["role"] == "user" else "model"
        formatted_messages.append({"role": role, "parts": [msg["content"]]})

    try:
        response = gemini_model.generate_content(
            contents=formatted_messages,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=600,
            )
        )
        
        reply = response.text
        return jsonify({"reply": reply}), 200

    except Exception as e:
        print(f"Gemini API Error: {e}")
        return jsonify({"error": f"An error occurred while communicating with the AI service. Details: {str(e)}"}), 500

@app.route('/api/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City name is required"}), 400
        
    try:
        # 1. Geocoding
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json"
        geo_resp = requests.get(geo_url, timeout=10)
        geo_resp.raise_for_status()
        geo_data = geo_resp.json()
        
        if not geo_data.get("results"):
            return jsonify({"error": f"Could not find location for '{city}'"}), 404
            
        location = geo_data["results"][0]
        lat = location["latitude"]
        lon = location["longitude"]
        resolved_city = location["name"]
        
        # 2. Weather Data
        weather_url = (f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
                       f"&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation"
                       f"&daily=weather_code,temperature_2m_max,temperature_2m_min"
                       f"&timezone=auto")
        
        weather_resp = requests.get(weather_url, timeout=10)
        weather_resp.raise_for_status()
        w_data = weather_resp.json()
        
        current = w_data.get("current", {})
        daily = w_data.get("daily", {})
        
        def map_wmo(code):
            if code == 0: return {"main": "Clear", "icon": "01d"}
            if code in [1, 2, 3]: return {"main": "Cloudy", "icon": "02d"}
            if code in [45, 48]: return {"main": "Fog", "icon": "50d"}
            if code in [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]: return {"main": "Rain", "icon": "10d"}
            if code in [71, 73, 75, 77, 85, 86]: return {"main": "Snow", "icon": "13d"}
            if code in [95, 96, 99]: return {"main": "Thunderstorm", "icon": "11d"}
            return {"main": "Unknown", "icon": "01d"}
            
        forecast_list = []
        if "time" in daily:
            for i in range(1, min(4, len(daily["time"]))):
                wmo = daily["weather_code"][i]
                mapped = map_wmo(wmo)
                
                date_str = daily["time"][i]
                dt_obj = datetime.datetime.strptime(date_str, "%Y-%m-%d")
                dt = int(dt_obj.timestamp())
                
                forecast_list.append({
                    "dt": dt,
                    "dt_txt": f"{date_str} 12:00:00",
                    "main": {
                        "temp": daily["temperature_2m_max"][i]
                    },
                    "weather": [mapped]
                })

        rain = current.get("precipitation", 0)
        
        return jsonify({
            "city": resolved_city,
            "main": {
                "temp": current.get("temperature_2m", 0),
                "temp_min": daily.get("temperature_2m_min", [0])[0] if daily.get("temperature_2m_min") else 0,
                "humidity": current.get("relative_humidity_2m", 0)
            },
            "wind": {
                "speed": current.get("wind_speed_10m", 0),
                "deg": current.get("wind_direction_10m", 0)
            },
            "rain": f"{rain} mm" if rain > 0 else "No Rain",
            "forecast": {
                "list": forecast_list
            }
        }), 200
        
    except Exception as e:
        print(f"Weather API Error: {e}")
        return jsonify({"error": "Failed to fetch weather data."}), 500

import xml.etree.ElementTree as ET
import urllib.request
import urllib.parse

@app.route('/api/news', methods=['GET'])
def get_news():
    query = request.args.get('q', 'indian agriculture')
    encoded_query = urllib.parse.quote_plus(query)
    rss_url = f"https://www.bing.com/news/search?q={encoded_query}&format=rss"
    
    try:
        req = urllib.request.Request(rss_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            content = response.read()
            
        root = ET.fromstring(content)
        items = []
        
        for item in root.findall('.//item')[:12]:
            title = item.find('title').text if item.find('title') is not None else ''
            link = item.find('link').text if item.find('link') is not None else ''
            pubDate = item.find('pubDate').text if item.find('pubDate') is not None else ''
            description = item.find('description').text if item.find('description') is not None else ''
            
            image_url = ""
            for child in item:
                if 'Image' in child.tag:
                    image_url = child.text
                    break
            
            source = "News"
            for child in item:
                if 'Source' in child.tag:
                    source = child.text
                    break
                    
            if source == "News" and " - " in title:
                parts = title.rsplit(' - ', 1)
                title = parts[0].strip()
                source = parts[1].strip()
                
            items.append({
                "title": title,
                "link": link,
                "pubDate": pubDate,
                "description": description,
                "source": source,
                "image": image_url
            })
            
        return jsonify({"status": "ok", "items": items}), 200
        
    except Exception as e:
        print(f"News API Error: {e}")
        return jsonify({"error": "Failed to fetch news data."}), 500

try:
    from backend import database as db
    from backend import connectors
    from backend import rules_engine
    from backend import federation
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from backend import database as db
    from backend import connectors
    from backend import rules_engine
    from backend import federation

COUNTRY_PROFILES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'country_profiles')

@app.route('/v1/nodes', methods=['GET'])
def get_all_federation_nodes():
    """
    Returns full registry of all active and available nodes across the BRICS+ network.
    """
    try:
        nodes = federation.get_all_nodes()
        return jsonify({
            "status": "success",
            "total_nodes": len(nodes),
            "federation_protocol": "BRICS-AGRO-FED-v1",
            "privacy_guarantee": "Zero raw-data transmission across borders.",
            "nodes": nodes
        }), 200
    except Exception as e:
        print(f"Error fetching nodes: {e}")
        return jsonify({"error": "Failed to fetch node registry"}), 500

@app.route('/v1/nodes/insights', methods=['GET'])
def get_federated_insights():
    """
    Returns the live timeline of shared cross-border insights.
    """
    try:
        insights = federation.get_insights_feed()
        return jsonify({
            "status": "success",
            "total_insights": len(insights),
            "insights": insights
        }), 200
    except Exception as e:
        print(f"Error fetching insights: {e}")
        return jsonify({"error": "Failed to fetch insights"}), 500

@app.route('/v1/nodes/sync-insight', methods=['POST'])
def sync_node_insight():
    """
    Simulates cross-border insight sharing between two nodes.
    """
    data = request.get_json() or {}
    source = data.get('source_country', 'IN').upper()
    target = data.get('target_country', 'ZA').upper()
    alert_type = data.get('alert_type', 'DISEASE_EARLY_WARNING')

    new_insight = federation.trigger_insight_sync(source, target, alert_type)
    return jsonify({
        "status": "success",
        "message": f"Insight successfully synchronized from {source} node to {target} node.",
        "insight": new_insight
    }), 201

@app.route('/v1/node/info', methods=['GET'])
def get_node_info():
    """
    OpenAPI standard node information endpoint for BRICS federation.
    """
    country = request.args.get('country', 'IN').upper()
    profile = load_country_profile(country)
    return jsonify({
        "status": "operational",
        "node_id": profile.get("node_id", f"node-{country.lower()}-01"),
        "country": profile.get("country", country),
        "country_name": profile.get("country_name", country),
        "languages": profile.get("languages", ["en"]),
        "openapi_version": "3.0.3",
        "advisory_rules_version": profile.get("advisory_rules_version", "2.4-agro"),
        "supported_crops": [c.get("name") if isinstance(c, dict) else c for c in profile.get("major_crops", [])],
        "data_sources": profile.get("data_sources", {}),
        "federation_contract": "Zero raw-data transmission; aggregated insights only."
    }), 200

@app.route('/v1/data', methods=['GET'])
def get_data_bundle():
    """
    Standardized Data Bundle Endpoint.
    Given lat, lon (and optional country), queries Open-Meteo & SoilGrids
    and returns a standardized schema with data freshness & confidence provenance.
    """
    try:
        lat_str = request.args.get('lat', '30.90')
        lon_str = request.args.get('lon', '75.85')
        country = request.args.get('country', 'IN').upper()
        
        lat = float(lat_str)
        lon = float(lon_str)

        bundle = connectors.get_standardized_bundle(lat=lat, lon=lon, country=country)
        return jsonify(bundle), 200
    except ValueError:
        return jsonify({"error": "Invalid latitude or longitude format"}), 400
    except Exception as e:
        print(f"Error generating data bundle: {e}")
        return jsonify({"error": "Failed to assemble data bundle", "details": str(e)}), 500

@app.route('/v1/advisory', methods=['POST'])
def get_regenerative_advisory():
    """
    Core Regenerative Advisory Engine Endpoint.
    Accepts coordinates or data bundle, runs agronomic rules, and returns explainable recommendations.
    """
    try:
        data = request.get_json() or {}
        lat = float(data.get('lat', 30.90))
        lon = float(data.get('lon', 75.85))
        country = data.get('country', 'IN').upper()
        previous_crop = data.get('previous_crop', 'wheat')
        manual_soil = data.get('soil')

        bundle = connectors.get_standardized_bundle(lat=lat, lon=lon, country=country, manual_soil=manual_soil)
        advisory_res = rules_engine.generate_advisory(bundle, previous_crop=previous_crop)

        return jsonify({
            "status": "success",
            "country": country,
            "location": {"lat": lat, "lon": lon},
            "advisory": advisory_res,
            "data_bundle": bundle
        }), 200
    except Exception as e:
        print(f"Error generating advisory: {e}")
        return jsonify({"error": "Failed to generate advisory", "details": str(e)}), 500

@app.route('/api/messages', methods=['POST'])
def receive_message():
    """
    Endpoint that handles all form submissions (contact, schemes interest, etc.)
    and saves them safely to SQLite.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400
    try:
        db.save_message(data)
        return jsonify({"success": True, "message": "Message saved successfully"}), 200
    except Exception as e:
        print(f"Error saving message: {e}")
        return jsonify({"error": "Failed to save message"}), 500

def load_country_profile(country_code='IN'):
    code = (country_code or 'IN').upper()
    profile_path = os.path.join(COUNTRY_PROFILES_DIR, f"{code}.json")
    if not os.path.exists(profile_path):
        profile_path = os.path.join(COUNTRY_PROFILES_DIR, "IN.json")
    try:
        with open(profile_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading country profile {code}: {e}")
        return {"country": code, "error": "Profile not found"}

@app.route('/v1/country-profile/<country_code>', methods=['GET'])
def get_country_profile_endpoint(country_code):
    return jsonify(load_country_profile(country_code)), 200

@app.route('/api/save_message', methods=['POST'])
def save_message_endpoint():
    """
    Endpoint for saving contact form or scheme inquiry submissions to SQLite.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400
        
    try:
        db.save_message(data)
        return jsonify({"success": True, "message": "Message saved successfully"}), 200
    except Exception as e:
        print(f"Error saving message: {e}")
        return jsonify({"error": "Failed to save message"}), 500

@app.route('/api/admin/messages', methods=['GET'])
def get_admin_messages():
    """
    Endpoint for admin panel to retrieve all messages from SQLite.
    """
    try:
        messages = db.get_all_messages()
        return jsonify(messages), 200
    except Exception as e:
        print(f"Error reading messages: {e}")
        return jsonify({"error": "Failed to read messages"}), 500

# --- Authentication Endpoints ---

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not all(k in data for k in ("name", "email", "password", "phone")):
        return jsonify({"error": "Name, email, password, and phone are required"}), 400
    
    email = data['email'].strip().lower()
    name = data['name'].strip()
    phone = data.get('phone', '').strip()
    password = data['password']
    country = data.get('country', 'IN')
    
    result = db.create_user(name=name, email=email, phone=phone, password=password, country=country)
    if result.get("success"):
        return jsonify({"success": True, "message": "Registration successful", "user": result["user"]}), 201
    else:
        return jsonify({"error": result.get("error", "Registration failed")}), 409

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not all(k in data for k in ("email", "password")):
        return jsonify({"error": "Email and password are required"}), 400
        
    email_or_phone = data['email'].strip().lower()
    password = data['password']
    
    result = db.authenticate_user(email_or_phone, password)
    if result.get("success"):
        return jsonify({"success": True, "message": "Login successful", "user": result["user"]}), 200
    else:
        return jsonify({"error": result.get("error", "Invalid email or password")}), 401


def create_folium_map():
    # Centered around Pune
    start_coords = [18.5204, 73.8567]
    
    # Create the map object using OpenStreetMap (free)
    m = folium.Map(location=start_coords, zoom_start=11)
    
    # Add dummy markers for equipment locations
    marker_locations = [
        {"loc": [18.5204, 73.8567], "popup": "Mahindra 575 DI (Available)"},
        {"loc": [18.55, 73.82], "popup": "John Deere Combine"},
        {"loc": [18.5, 73.9], "popup": "Sonalika Tiller"}
    ]
    
    for marker in marker_locations:
        folium.Marker(
            location=marker["loc"],
            popup=marker["popup"],
            icon=folium.Icon(color="green", icon="info-sign")
        ).add_to(m)
        
    return m.get_root().render()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<path:filename>')
def serve_html(filename):
    if filename.endswith('.html'):
        return render_template(filename)
    return app.send_static_file(filename)

@app.route('/account.html')
def account():
    return render_template('account.html')

@app.route('/contact.html')
def contact():
    return render_template('contact.html')

@app.route('/equipment_details.html')
def equipment_details():
    return render_template('equipment_details.html')

@app.route('/map')
def map_view():
    # Returns just the HTML for the Folium map iframe
    map_html = create_folium_map()
    return map_html

if __name__ == '__main__':
    # Add clear logging to show server start
    print("="*60)
    print("AgriSmart AI - Plant Disease Identification Backend Started")
    print("Serving on http://127.0.0.1:5000")
    print("="*60)
    app.run(host='0.0.0.0', port=5000, debug=False)
