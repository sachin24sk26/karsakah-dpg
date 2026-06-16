<div align="center">
  <h1>🌾 KARSAKAH 🌾</h1>
  <p><strong>AI-Powered Agricultural Platform</strong></p>
  <p>Empowering farmers with cutting-edge AI technology and real-time data.</p>
</div>

---

## 📖 About The Project

KARSAKAH is a comprehensive agricultural platform designed to revolutionize farming management. From instant crop disease diagnosis using artificial intelligence to live market price tracking, KARSAKAH provides farmers with the tools they need to make informed decisions and increase their yield.

### 🚀 Key Features

* **AI-Powered Crop Diagnosis**: Instantly detect diseases and get treatment recommendations by uploading a leaf image, powered by Google Gemini AI.
* **Agricultural AI Chatbot**: Meet "KARSAKAH", your friendly AI assistant ready to help with farming advice, best practices, and more.
* **Live Market Prices**: Track real-time prices for various crops (Corn, Wheat, Soybeans, etc.) to make the best selling decisions.
* **Weather Forecasts**: Get accurate, location-based weather updates including temperature, humidity, and clear forecasts.
* **Multi-Language Support**: Accessible to a wider audience with support for English, Hindi (हिन्दी), Marathi (मराठी), and Punjabi (ਪੰਜਾਬੀ).
* **Government Schemes Hub**: A centralized hub to explore subsidies, financial aid, and government initiatives for farmers.
* **Admin Dashboard**: Efficiently manage and track user messages and inquiries.

## 🛠️ Built With

* **Frontend**: HTML5, CSS3 (Vanilla), JavaScript
* **Backend**: Python, Flask
* **AI Integration**: Google Gemini API (`google-generativeai`)
* **APIs**: [Open-Meteo](https://open-meteo.com/) (Weather data)
* **Database**: Local JSON storage (`messages.json`)

## 📥 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Python 3.8+
* A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ByteForce.git
   cd ByteForce
   ```

2. **Set up a Virtual Environment**
   ```bash
   python -m venv .venv
   # On Windows
   .venv\Scripts\activate
   # On macOS/Linux
   source .venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

5. **Run the Backend Server**
   ```bash
   python app.py
   ```
   The Flask server will start on `http://127.0.0.1:5000`.

6. **Open the Frontend**
   Simply open `index.html` in your favorite web browser to start using KARSAKAH.

## 👥 Contributors

* **Sachin**
* **Harshit**

---

<div align="center">
  <p>© 2026 KARSAKAH. Empowering Farmers with AI.</p>
</div>
