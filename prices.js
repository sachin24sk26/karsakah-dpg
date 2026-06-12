// Translations are now handled globally via translate.js
// Mock Data for Fallback/Testing in case API key is missing or CORS blocks
const mockData = [
    { state: "Maharashtra", district: "Pune", market: "Pune", commodity: "Onion", min_price: "1500", max_price: "2400", modal_price: "1950", arrival_date: "28/02/2026" },
    { state: "Maharashtra", district: "Nashik", market: "Lasalgaon", commodity: "Onion", min_price: "1600", max_price: "2600", modal_price: "2100", arrival_date: "28/02/2026" },
    { state: "Maharashtra", district: "Latur", market: "Latur", commodity: "Soyabean", min_price: "4200", max_price: "4680", modal_price: "4500", arrival_date: "28/02/2026" },
    { state: "Punjab", district: "Ludhiana", market: "Khanna", commodity: "Wheat", min_price: "2125", max_price: "2200", modal_price: "2150", arrival_date: "28/02/2026" },
    { state: "Punjab", district: "Amritsar", market: "Amritsar", commodity: "Wheat", min_price: "2100", max_price: "2180", modal_price: "2140", arrival_date: "28/02/2026" },
    { state: "Uttar Pradesh", district: "Agra", market: "Agra", commodity: "Potato", min_price: "800", max_price: "1100", modal_price: "950", arrival_date: "28/02/2026" },
    { state: "Madhya Pradesh", district: "Indore", market: "Indore", commodity: "Soyabean", min_price: "4100", max_price: "4750", modal_price: "4600", arrival_date: "28/02/2026" },
    { state: "Gujarat", district: "Rajkot", market: "Rajkot", commodity: "Cotton", min_price: "6800", max_price: "7200", modal_price: "7000", arrival_date: "28/02/2026" }
];

// Open Government Data API configuration
// Note: This is a public key format. You can replace it with your own key from data.gov.in
const API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const API_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json`;

// DOM Elements
const langSelect = document.getElementById('lang-select');
const stateSelect = document.getElementById('state-select');
const commoditySelect = document.getElementById('commodity-select');
const searchBtn = document.getElementById('search-btn');
const tableBody = document.getElementById('table-body');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const noDataMessage = document.getElementById('no-data');
const tableWrapper = document.querySelector('.table-responsive');

// updateLanguage is handled by translate.js globally
// Fetch Prices from API or fallback
async function fetchPrices(state = "", commodity = "") {
    // Show loader, hide errors and table contents
    loader.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    noDataMessage.classList.add('hidden');
    tableBody.innerHTML = '';

    let queryUrl = `${API_URL}&limit=50`;
    if (state) queryUrl += `&filters[state.keyword]=${encodeURIComponent(state)}`;
    if (commodity) queryUrl += `&filters[commodity]=${encodeURIComponent(commodity)}`;

    try {
        const response = await fetch(queryUrl);
        if (!response.ok) throw new Error('API fetch error');

        const data = await response.json();
        const records = data.records;

        if (records && records.length > 0) {
            renderTable(records);
        } else {
            showNoData();
        }
    } catch (error) {
        console.warn('API Error, falling back to mock data:', error);
        errorText.textContent = "Failed to fetch live API data. Showing offline estimates for demo.";
        errorMessage.classList.remove('hidden');

        // Use Mock Data
        setTimeout(() => {
            let filtered = mockData;
            if (state) filtered = filtered.filter(f => f.state === state);
            if (commodity) filtered = filtered.filter(f => f.commodity === commodity);

            if (filtered.length > 0) {
                renderTable(filtered);
            } else {
                showNoData();
            }
        }, 800);
    }
}

function renderTable(records) {
    loader.classList.add('hidden');
    tableBody.innerHTML = '';

    records.forEach(record => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="font-weight: 600;">${record.commodity}</div>
            </td>
            <td>${record.state}</td>
            <td>${record.market}</td>
            <td>₹${record.min_price}</td>
            <td>₹${record.max_price}</td>
            <td class="price-val">₹${record.modal_price}</td>
            <td>${record.arrival_date}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function showNoData() {
    loader.classList.add('hidden');
    noDataMessage.classList.remove('hidden');
}



searchBtn.addEventListener('click', () => {
    const state = stateSelect.value;
    const commodity = commoditySelect.value;
    fetchPrices(state, commodity);
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // Translate to default lang or saved logic handled globally

    // Fetch initial data
    fetchPrices();
});
