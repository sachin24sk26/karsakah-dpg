// Script for Mandi Page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Chart
    const ctx = document.getElementById('priceTrendChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1', '5', '10', '15', '20', '25', '30'],
                datasets: [{
                    label: 'Wheat (₹/qtl)',
                    data: [2300, 2350, 2320, 2400, 2380, 2420, 2450],
                    borderColor: '#2e7d32',
                    tension: 0.3,
                    fill: false
                }, {
                    label: 'Soybean (₹/qtl)',
                    data: [4100, 4050, 4150, 4200, 4180, 4250, 4200],
                    borderColor: '#1e40af',
                    tension: 0.3,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    // Role Toggling initially
    setRole('seller');
});

// Role selection (Seller / Buyer)
function setRole(role) {
    // Update buttons
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Show/Hide sections based on role
    const sellerSections = document.querySelectorAll('.seller-only');
    
    if (role === 'seller') {
        sellerSections.forEach(el => el.style.display = 'block');
    } else {
        sellerSections.forEach(el => el.style.display = 'none');
    }
}

// Modal logic
const modal = document.getElementById('listLotModal');

function openListLotModal() {
    if (modal) modal.style.display = 'block';
}

function closeListLotModal() {
    if (modal) modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
