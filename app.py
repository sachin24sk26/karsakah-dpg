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

# Python 3.14 removed pkgutil.get_loader. Provide a fallback for Flask package discovery.
if not hasattr(pkgutil, 'get_loader'):
    def _get_loader(name):
        try:
            spec = importlib.util.find_spec(name)
        except (ImportError, ValueError):
            return None
        return spec.loader if spec is not None else None
    pkgutil.get_loader = _get_loader

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

@app.route('/api/analyze', methods=['POST'])
def analyze_crop():
    """
    Endpoint that simulates receiving an image and passing it through a Kaggle ML model.
    Returns the identified disease, confidence score, and recommendations.
    """
    # 1. Check if an image was uploaded
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Use Gemini directly for detailed image diagnosis
    if gemini_model:
        try:
            image_data = file.read()
            mime_type = file.content_type if file.content_type else "image/jpeg"
            image_parts = [{"mime_type": mime_type, "data": image_data}]
            
            # Step 1: Validate
            prompt_valid = "Analyze this image. Is it a picture of a crop, a plant, a leaf, or related to agriculture? Answer ONLY 'Yes' or 'No'."
            validation_response = gemini_model.generate_content([image_parts[0], prompt_valid])
            if 'no' in validation_response.text.strip().lower() and 'yes' not in validation_response.text.strip().lower():
                return jsonify({"error": "unwanted image. Please upload a clear picture of a crop."}), 400
            
            # Step 2: Full Diagnosis Request
            prompt_diag = """You are an expert plant pathologist. Analyze this plant/leaf image.
            Return a JSON object accurately answering the properties below. Do not return Markdown or backticks, just raw JSON:
            {
              "status": "Infected" or "Healthy",
              "disease": "Specific Name of Disease (e.g., Marssonina Blotch / Apple Leaf Blotch (Marssonina coronaria))",
              "confidence": numerical float between 0 and 100, representing your confidence,
              "symptoms": "A detailed description of the symptoms based on the image",
              "immediate_action": ["Action 1", "Action 2"],
              "treatment_options": {
                "organic": ["Organic solution 1", "Organic solution 2"],
                "chemical": ["Chemical solution 1", "Chemical solution 2"]
              },
              "prevention": ["Prevention tip 1", "Prevention tip 2"]
            }"""
            
            diagnosis_response = gemini_model.generate_content([image_parts[0], prompt_diag])
            
            # Clean possible markdown block wrappers
            text_response = diagnosis_response.text.strip()
            if text_response.startswith('```json'):
                text_response = text_response[7:-3].strip()
            elif text_response.startswith('```'):
                text_response = text_response[3:-3].strip()
                
            response_data = json.loads(text_response)
            
            # Standardize numeric confidence if generated as string
            try:
                response_data["confidence"] = float(response_data.get("confidence", 0.0))
            except:
                response_data["confidence"] = 92.0
                
            return jsonify(response_data), 200
            
        except Exception as e:
            print(f"Gemini API error during analysis: {e}")
            return jsonify({"error": "AI processing error failed to complete diagnosis."}), 500
    else:
        return jsonify({"error": "Gemini API key is not configured."}), 500


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

@app.route('/api/messages', methods=['POST'])
def receive_message():
    """
    Endpoint that handles all form submissions (contact, schemes interest, etc.)
    and saves them sequentially into a local json file structure.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400
        
    data['timestamp'] = datetime.datetime.now().isoformat()
    
    messages_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'messages.json')
    messages = []
    
    if os.path.exists(messages_file):
        try:
            with open(messages_file, 'r', encoding='utf-8') as f:
                messages = json.load(f)
        except Exception as e:
            print(f"Error reading existing messages: {e}")
            pass
            
    messages.append(data)
    
    try:
        with open(messages_file, 'w', encoding='utf-8') as f:
            json.dump(messages, f, indent=4)
        print(f"New message saved to {messages_file}")
        return jsonify({"success": True, "message": "Message saved successfully"}), 200
    except Exception as e:
        print(f"Error saving message: {e}")
        return jsonify({"error": "Failed to save message"}), 500

@app.route('/api/admin/messages', methods=['GET'])
def get_admin_messages():
    """
    Endpoint for admin panel to retrieve all messages.
    """
    messages_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'messages.json')
    if os.path.exists(messages_file):
        try:
            with open(messages_file, 'r', encoding='utf-8') as f:
                messages = json.load(f)
            # Sort messages by timestamp descending
            messages.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
            return jsonify(messages), 200
        except Exception as e:
            print(f"Error reading existing messages: {e}")
            return jsonify({"error": "Failed to read messages"}), 500
    return jsonify([]), 200

@app.route('/api/admin/messages', methods=['DELETE'])
def delete_admin_message():
    """
    Endpoint for admin panel to delete a message by timestamp.
    """
    data = request.get_json()
    if not data or 'timestamp' not in data:
        return jsonify({"error": "Timestamp is required"}), 400
        
    timestamp = data['timestamp']
    messages_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'messages.json')
    
    if os.path.exists(messages_file):
        try:
            with open(messages_file, 'r', encoding='utf-8') as f:
                messages = json.load(f)
            
            initial_len = len(messages)
            messages = [m for m in messages if m.get('timestamp') != timestamp]
            
            if len(messages) < initial_len:
                with open(messages_file, 'w', encoding='utf-8') as f:
                    json.dump(messages, f, indent=4)
                return jsonify({"success": True}), 200
            else:
                return jsonify({"error": "Message not found"}), 404
        except Exception as e:
            print(f"Error deleting message: {e}")
            return jsonify({"error": "Failed to delete message"}), 500
            
    return jsonify({"error": "Messages file not found"}), 404

# --- Authentication Endpoints ---

USERS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'users.json')

def load_users():
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading users: {e}")
    return []

def save_users(users):
    try:
        with open(USERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(users, f, indent=4)
        return True
    except Exception as e:
        print(f"Error saving users: {e}")
        return False

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not all(k in data for k in ("name", "email", "password", "phone")):
        return jsonify({"error": "Name, email, password, and phone are required"}), 400
    
    email = data['email'].lower()
    users = load_users()
    
    # Check if user exists
    if any(u['email'].lower() == email for u in users):
        return jsonify({"error": "Email already registered"}), 409
        
    new_user = {
        "id": f"usr_{int(time.time())}_{random.randint(1000, 9999)}",
        "name": data['name'],
        "email": email,
        "phone": data['phone'],
        "password": data['password'], # In a real app, hash this securely!
        "created_at": datetime.datetime.now().isoformat()
    }
    
    users.append(new_user)
    if save_users(users):
        # Don't send password back in response
        user_response = {k: v for k, v in new_user.items() if k != 'password'}
        return jsonify({"success": True, "message": "Registration successful", "user": user_response}), 201
    else:
        return jsonify({"error": "Failed to save user"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not all(k in data for k in ("email", "password")):
        return jsonify({"error": "Email and password are required"}), 400
        
    email = data['email'].lower()
    password = data['password']
    
    users = load_users()
    
    user = next((u for u in users if u['email'].lower() == email and u['password'] == password), None)
    
    if user:
        user_response = {k: v for k, v in user.items() if k != 'password'}
        return jsonify({"success": True, "message": "Login successful", "user": user_response}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401


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
