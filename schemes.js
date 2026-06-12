const schemesData = [
    {
        id: "s1",
        title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        desc: "An initiative by the government of India in which all farmers will get up to ₹6,000 per year as minimum income support.",
        state: "Central",
        category: "Financial Assistance"
    },
    {
        id: "s2",
        title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        desc: "Provides a comprehensive insurance cover against failure of the crop thus helping in stabilising the income of the farmers.",
        state: "Central",
        category: "Insurance"
    },
    {
        id: "s3",
        title: "Kisan Credit Card (KCC)",
        desc: "Provides farmers with timely and adequate credit for agriculture and allied activities.",
        state: "Central",
        category: "Credit"
    },
    {
        id: "s4",
        title: "Magel Tyala Shettale (Farm Pond On Demand)",
        desc: "Maharashtra state initiative to provide a farm pond to every demanding farmer to tackle drought and ensure water storage.",
        state: "Maharashtra",
        category: "Irrigation"
    },
    {
        id: "s5",
        title: "Mukhyamantri Saur Krushi Pump Yojana",
        desc: "Subsidy for solar agriculture pumps to ensure daytime power availability for irrigation in Maharashtra.",
        state: "Maharashtra",
        category: "Subsidies"
    },
    {
        id: "s6",
        title: "Pani Bachao, Paisa Kamao",
        desc: "An innovative scheme to help farmers in Punjab save water and electricity by providing financial incentives.",
        state: "Punjab",
        category: "Financial Assistance"
    },
    {
        id: "s7",
        title: "Khet Talab Yojana",
        desc: "Subsidy provided to farmers in Uttar Pradesh for the construction of ponds in agricultural fields.",
        state: "Uttar Pradesh",
        category: "Irrigation"
    },
    {
        id: "s8",
        title: "Mukhyamantri Krishi Ashirwad Yojana",
        desc: "Financial assistance to farmers to purchase seeds, fertilizers, and other required items for farming.",
        state: "Jharkhand",
        category: "Financial Assistance"
    },
    {
        id: "s9",
        title: "Bhavantar Bhugtan Yojana",
        desc: "Price deficit financing scheme to ensure farmers get at least the Minimum Support Price (MSP) for their crops.",
        state: "Madhya Pradesh",
        category: "Financial Assistance"
    },
    {
        id: "s10",
        title: "Saur Sujala Yojana",
        desc: "Solar irrigation pumps provided at subsidized rates to farmers in Chhattisgarh.",
        state: "Chhattisgarh",
        category: "Subsidies"
    }
];

const stateSelect = document.getElementById('state-select');
const categorySelect = document.getElementById('category-select');
const applicantStateSelect = document.getElementById('applicant-state');
const grid = document.getElementById('schemes-grid');
const noData = document.getElementById('no-data');

const modal = document.getElementById('interest-modal');
const closeBtn = document.querySelector('.close-btn');
const interestForm = document.getElementById('interest-form');

const states = [...new Set(schemesData.map(s => s.state))].sort();
const categories = [...new Set(schemesData.map(s => s.category))].sort();

function initFilters() {
    // Group states explicitly
    const optgroupCentral = document.createElement("optgroup");
    optgroupCentral.label = "Central Government";
    
    const optgroupStates = document.createElement("optgroup");
    optgroupStates.label = "State Government";

    states.forEach(state => {
        if (state === 'Central') {
            optgroupCentral.appendChild(new Option("Central Schemes", "Central"));
        } else {
            optgroupStates.appendChild(new Option(state, state));
            applicantStateSelect.add(new Option(state, state));
        }
    });

    stateSelect.appendChild(optgroupCentral);
    stateSelect.appendChild(optgroupStates);

    categories.forEach(cat => {
        categorySelect.add(new Option(cat, cat));
    });
    
    // Default to a typical state for user onboarding mapping
    applicantStateSelect.add(new Option("Other", "Other"));
}

function renderCards() {
    grid.innerHTML = '';
    const selState = stateSelect.value;
    const selCat = categorySelect.value;

    const filtered = schemesData.filter(s => {
        const stateMatch = selState === 'All' || s.state === selState;
        const catMatch = selCat === 'All' || s.category === selCat;
        return stateMatch && catMatch;
    });

    if (filtered.length === 0) {
        noData.classList.remove('hidden');
    } else {
        noData.classList.add('hidden');
        const fragment = document.createDocumentFragment();
        filtered.forEach(scheme => {
            const card = document.createElement('div');
            card.className = 'scheme-card';
            
            card.innerHTML = `
                <div class="scheme-badges">
                    <span class="badge state">${scheme.state}</span>
                    <span class="badge category">${scheme.category}</span>
                </div>
                <h3>${scheme.title}</h3>
                <p>${scheme.desc}</p>
                <button class="btn btn-primary" onclick="openModal('${scheme.id}')">
                    I'm Interested
                </button>
            `;
            fragment.appendChild(card);
        });
        grid.appendChild(fragment);
    }
}

let successTimeout;

function openModal(schemeId) {
    if (successTimeout) clearTimeout(successTimeout);

    const scheme = schemesData.find(s => s.id === schemeId);
    if (!scheme) return;
    
    document.getElementById('modal-scheme-title').innerText = scheme.title;
    document.getElementById('scheme-id').value = schemeId;

    // Check if user is logged in and pre-fill form
    const userStr = localStorage.getItem('karsakah_user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.name) document.getElementById('applicant-name').value = user.name;
            if (user.phone) document.getElementById('applicant-phone').value = user.phone;
        } catch (e) {
            console.error("Error parsing user data for pre-fill", e);
        }
    }
    
    // Ensure the form is visible and message is hidden
    interestForm.classList.remove('hidden');
    document.getElementById('success-msg').classList.add('hidden');
    
    modal.classList.remove('hidden');
}

closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        const isSuccessVisible = !document.getElementById('success-msg').classList.contains('hidden');
        if (!isSuccessVisible) {
            modal.classList.add('hidden');
        }
    }
});

interestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = interestForm.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = 'Submitting...';
    btn.disabled = true;

    const schemeId = document.getElementById('scheme-id').value;
    const applicantName = document.getElementById('applicant-name').value;
    const applicantPhone = document.getElementById('applicant-phone').value;
    const applicantState = document.getElementById('applicant-state').value;

    const scheme = schemesData.find(s => s.id === schemeId);
    const schemeName = scheme ? scheme.title : 'Unknown Scheme';
    const schemeType = scheme ? scheme.category : 'Unknown Category';
    const schemeOriginState = scheme ? scheme.state : 'Unknown State';

    const userStr = localStorage.getItem('karsakah_user');
    let email = 'N/A';
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.email) email = user.email;
        } catch(e) {}
    }

    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                form_type: 'SCHEME_INTEREST', 
                schemeId, 
                name: applicantName, 
                phone: applicantPhone, 
                applicantState,
                email: email,
                schemeName: schemeName,
                schemeType: schemeType,
                schemeState: schemeOriginState
            })
        });

        if (response.ok) {
            // Hide the input form, show the success message
            interestForm.classList.add('hidden');
            document.getElementById('success-msg').classList.remove('hidden');
            
            // Auto-close after 3 seconds so the user can see the message
            successTimeout = setTimeout(() => {
                modal.classList.add('hidden');
            }, 3000);
            
            // Reset form for next use
            interestForm.reset();
        } else {
            alert('Failed to submit interest. Please try again.');
        }
    } catch (error) {
        alert('Error connecting to server. Is the backend running?');
        console.error(error);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
});

stateSelect.addEventListener('change', renderCards);
categorySelect.addEventListener('change', renderCards);

// Initialization
window.addEventListener('DOMContentLoaded', () => {
    initFilters();
    renderCards();
});
