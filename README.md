# KARSAKAH - AI-Powered Agricultural Platform 🌾

KARSAKAH is a comprehensive agricultural platform designed to empower farmers with cutting-edge AI technology and real-time data. From instant crop disease diagnosis to live market price tracking, KARSAKAH aims to revolutionize the way farming is managed.

## 🚀 Key Features

- **AI-Powered Crop Diagnosis**: Upload a leaf image to instantly detect diseases and get treatment recommendations using Google Gemini AI.
- **Agricultural AI Chatbot**: A friendly AI assistant ("KARSAKAH") to help with farming advice, best practices, and more.
- **Live Market Prices**: Track real-time prices for various crops (Corn, Wheat, Soybeans, etc.) to make informed selling decisions.
- **Weather Forecasts**: Location-based weather updates including temperature, humidity, and clear forecasts.
- **Multi-Language Support**: Accessible in English, Hindi (हिन्दी), Marathi (मराठी), and Punjabi (ਪੰਜਾਬੀ).
- **Government Schemes Hub**: A central place to explore subsidies and financial aid for farmers.
- **Admin Dashboard**: Manage and track user messages and inquiries efficiently.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla CSS), JavaScript.
- **Backend**: Python, Flask.
- **AI**: Google Gemini API (via `google-generativeai`).
- **APIs**: [Open-Meteo](https://open-meteo.com/) for location-based weather data.
- **Database**: Local JSON storage for messages (`messages.json`).

## 📥 Installation & Setup

To run KARSAKAH locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/ByteForce.git
   cd ByteForce
   ```

2. **Set up a Virtual Environment**:

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API Key:

   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

5. **Run the Backend Server**:

   ```bash
   python app.py
   ```

   The Flask server will start on `http://127.0.0.1:5000`.

6. **Open the Frontend**:
   Simply open `index.html` in your favorite web browser.

## 👥 Contributors

- **Sachin**
- **Harshit**
- **Saklain**
- **Shubham**

---

© 2026 KARSAKAH. Empowering Farmers with AI.
