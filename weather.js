// OpenWeather API removed in favor of IMD Backend Proxy
const searchBtn = document.getElementById("search-btn");
const stateSelect = document.getElementById("state-select");
const citySelect = document.getElementById("city-select");
const manualCityInput = document.getElementById("manual-city-input");
const weatherResults = document.getElementById("weather-results");
const loader = document.getElementById("loader");
const errorMessage = document.getElementById("error-message");

const STATE_CITY_MAP = {
  Maharashtra: [
    "Pune",
    "Mumbai",
    "Nagpur",
    "Nashik",
    "Aurangabad",
    "Solapur",
    "Amravati",
    "Kolhapur",
  ],
  Karnataka: [
    "Bengaluru",
    "Mysuru",
    "Hubballi",
    "Mangaluru",
    "Belagavi",
    "Davangere",
    "Ballari",
    "Vijayapura",
  ],
  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Jamnagar",
    "Gandhinagar",
    "Junagadh",
  ],
  Punjab: [
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    "Patiala",
    "Bathinda",
    "Hoshiarpur",
    "Mohali",
    "Batala",
  ],
  Haryana: [
    "Faridabad",
    "Gurugram",
    "Panipat",
    "Ambala",
    "Yamunanagar",
    "Rohtak",
    "Hisar",
    "Karnal",
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Ghaziabad",
    "Agra",
    "Varanasi",
    "Meerut",
    "Prayagraj",
    "Bareilly",
  ],
  "Madhya Pradesh": [
    "Indore",
    "Bhopal",
    "Jabalpur",
    "Gwalior",
    "Ujjain",
    "Sagar",
    "Dewas",
    "Satna",
  ],
  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Kota",
    "Bikaner",
    "Ajmer",
    "Udaipur",
    "Bhilwara",
    "Alwar",
  ],
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Kurnool",
    "Rajahmundry",
    "Tirupati",
    "Kadapa",
  ],
  Telangana: [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Karimnagar",
    "Ramagundam",
    "Khammam",
    "Mahbubnagar",
    "Nalgonda",
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tirunelveli",
    "Tiruppur",
    "Ranipet",
  ],
  "West Bengal": [
    "Kolkata",
    "Asansol",
    "Siliguri",
    "Durgapur",
    "Bardhaman",
    "Malda",
    "Baharampur",
    "Habra",
  ],
  Bihar: [
    "Patna",
    "Gaya",
    "Bhagalpur",
    "Muzaffarpur",
    "Purnia",
    "Darbhanga",
    "Bihar Sharif",
    "Arrah",
  ],
};

// Initialize State Dropdown
function initStateDropdown() {
  const states = Object.keys(STATE_CITY_MAP).sort();
  states.forEach((state) => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });
}

initStateDropdown();

stateSelect.addEventListener("change", () => {
  const selectedState = stateSelect.value;
  citySelect.innerHTML =
    '<option value="" disabled selected>Select City</option>';

  if (selectedState && STATE_CITY_MAP[selectedState]) {
    const cities = STATE_CITY_MAP[selectedState].sort();
    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
    citySelect.disabled = false;
  } else {
    citySelect.disabled = true;
  }
});

searchBtn.addEventListener("click", () => {
  const city = manualCityInput.value.trim() || citySelect.value;
  if (city) {
    fetchWeather(city);
  }
});

manualCityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = manualCityInput.value.trim();
        if (city) {
            stateSelect.value = "";
            citySelect.innerHTML = '<option value="" disabled selected>Select City</option>';
            citySelect.disabled = true;
            fetchWeather(city);
        }
    }
});

citySelect.addEventListener("change", () => {
  manualCityInput.value = "";
  const city = citySelect.value;
  if (city) {
    fetchWeather(city);
  }
});

function showLoader() {
  loader.classList.remove("hidden");
  weatherResults.classList.add("hidden");
  errorMessage.classList.add("hidden");
}

async function fetchWeather(city) {
  showLoader();
  try {
    // Fetch from our local backend proxy which scrapes IMD
    const weatherRes = await fetch(
      `/api/weather?city=${city}`,
    );
    if (!weatherRes.ok) {
      const errData = await weatherRes.json();
      throw new Error(errData.error || "City not found on IMD");
    }
    const weatherData = await weatherRes.json();

    // We now have 3-day forecast from backend
    displayWeather(weatherData);
    if (weatherData.forecast) {
      populateForecast(weatherData.forecast);
    }
  } catch (err) {
    loader.classList.add("hidden");
    errorMessage.classList.remove("hidden");
    document.getElementById("error-text").innerText =
      err.message || "Failed to fetch data";
  }
}

function displayWeather(data) {
  loader.classList.add("hidden");
  weatherResults.classList.remove("hidden");

  // 1. Temperature
  document.getElementById("temp-value").innerText =
    `${Math.round(data.main.temp)}°C`;
  document.getElementById("temp-desc").innerText =
    `Min ${Math.round(data.main.temp_min)}°C`;

  // 3. Wind Speed
  if (data.wind) {
    document.getElementById("wind-value").innerText = `${data.wind.speed} km/h`;
    document.getElementById("wind-dir").innerText = getWindDir(data.wind.deg);
  } else {
    document.getElementById("wind-value").innerText = "-- km/h";
    document.getElementById("wind-dir").innerText = "--";
  }

  // Update the title in html manually if wanted, but using existing element ids
  const windHeader = document.querySelector(".weather-icon.wind + h3");
  if (windHeader) windHeader.innerText = "Wind Speed";

  // 4. Rain Forecast
  document.getElementById("rain-value").innerText = data.rain;

  // 2. Soil Moisture Estimation
  let moistureEst = data.main.humidity;
  if (data.rain !== "NIL" && data.rain) {
    moistureEst = Math.min(100, moistureEst + 15);
  } else if (data.main.temp > 30) {
    moistureEst = Math.max(10, moistureEst - 20);
  }
  document.getElementById("moisture-value").innerText = `${moistureEst}%`;

  // 5. Forecast is now populated in fetchWeather after displayWeather
}

function getWindDir(deg) {
  if (deg > 337.5) return "N";
  if (deg > 292.5) return "NW";
  if (deg > 247.5) return "W";
  if (deg > 202.5) return "SW";
  if (deg > 157.5) return "S";
  if (deg > 122.5) return "SE";
  if (deg > 67.5) return "E";
  if (deg > 22.5) return "NE";
  return "N";
}

function populateForecast(forecastData) {
  const container = document.getElementById("forecast-container");
  container.innerHTML = "";

  const dailyData = forecastData.list;
  const daysToShow = dailyData.slice(0, 3);

  daysToShow.forEach((day) => {
    const dateObj = new Date(day.dt * 1000);
    const dayStr = dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

    const div = document.createElement("div");
    div.className = "forecast-item";
    div.innerHTML = `
            <div class="forecast-date">${dayStr}</div>
            <div class="forecast-condition">
                <img src="${iconUrl}" alt="icon" style="width: 40px; height: 40px;">
                <span>${day.weather[0].main}</span>
            </div>
            <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
        `;
    container.appendChild(div);
  });
}

window.addEventListener("load", () => {
  // Always default to Pune initially, or let the user select
  fetchWeather("Pune");
});
