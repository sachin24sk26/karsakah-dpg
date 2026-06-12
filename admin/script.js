document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked link
            link.classList.add('active');

            // Show target section
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Stat card navigation
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 2) {
        statCards.forEach(card => card.style.cursor = 'pointer');
        
        statCards[0].addEventListener('click', () => {
            document.querySelector('.nav-links li[data-target="messages-section"]').click();
        });
        
        statCards[1].addEventListener('click', () => {
            document.querySelector('.nav-links li[data-target="users-section"]').click();
        });
    }

    // Fetch and Process Data
    fetchData();

    async function fetchData() {
        try {
            // Use absolute URL to support opening html directly
            const response = await fetch('/api/admin/messages');
            if (!response.ok) {
                console.error("Failed to fetch messages");
                return;
            }
            const messages = await response.json();
            
            processMessages(messages);
            processSchemes(messages);
            processUsers(messages);
            
            // Update Dashboard Stats
            document.getElementById('total-messages-count').textContent = messages.length;
            
        } catch (error) {
            console.error('Error fetching data:', error);
            // Optionally update UI to show error / ensure zeros
            document.getElementById('total-messages-count').textContent = "0";
            document.getElementById('total-users-count').textContent = "0";
        }
    }

    function processMessages(messages) {
        const tbody = document.getElementById('messages-table-body');
        tbody.innerHTML = '';
        
        messages.forEach(msg => {
            const tr = document.createElement('tr');
            
            // Format Date
            const dateObj = new Date(msg.timestamp);
            const dateStr = isNaN(dateObj.getTime()) ? 'Unknown Date' : 
                            (dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
            
            // Determine badge type based on form_type or subject
            let badgeClass = 'badge-other';
            let typeText = msg.form_type || 'General';
            
            if (typeText.toLowerCase() === 'contact') badgeClass = 'badge-contact';
            if (typeText.toLowerCase() === 'scheme') badgeClass = 'badge-scheme';
            
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td><strong>${msg.name || 'Unknown'}</strong></td>
                <td>${msg.email || 'N/A'}</td>
                <td>${msg.subject || 'N/A'}</td>
                <td style="max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${msg.message || ''}">
                    ${msg.message || ''}
                </td>
                <td><span class="badge ${badgeClass}">${typeText}</span></td>
                <td>
                    <button class="delete-btn" data-timestamp="${msg.timestamp}" style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 4px;" title="Delete Message">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Add delete event listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const timestamp = e.currentTarget.getAttribute('data-timestamp');
                if (confirm('Are you sure you want to delete this message?')) {
                    await deleteMessage(timestamp);
                }
            });
        });
    }

    async function deleteMessage(timestamp) {
        try {
            const response = await fetch('/api/admin/messages', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timestamp: timestamp })
            });
            
            if (response.ok) {
                fetchData(); // Refresh UI
            } else {
                alert('Failed to delete message');
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Error deleting message');
        }
    }

    function processUsers(messages) {
        // Extract unique users based on email
        const usersMap = new Map();
        
        messages.forEach(msg => {
            if (!msg.email || msg.email.trim() === '') return;
            
            const email = msg.email.toLowerCase();
            if (!usersMap.has(email)) {
                usersMap.set(email, {
                    name: msg.name || 'Unknown',
                    email: msg.email,
                    firstContact: msg.timestamp,
                    interactions: 1
                });
            } else {
                const user = usersMap.get(email);
                user.interactions += 1;
                // Update first contact if this message is older
                if (new Date(msg.timestamp) < new Date(user.firstContact)) {
                    user.firstContact = msg.timestamp;
                }
            }
        });
        
        const usersArray = Array.from(usersMap.values());
        
        // Update Dashboard User Count
        document.getElementById('total-users-count').textContent = usersArray.length;
        
        // Render Users Table
        const tbody = document.getElementById('users-table-body');
        tbody.innerHTML = '';
        
        usersArray.forEach(user => {
            const tr = document.createElement('tr');
            
            const dateObj = new Date(user.firstContact);
            const dateStr = isNaN(dateObj.getTime()) ? 'Unknown Date' : dateObj.toLocaleDateString();
            
            tr.innerHTML = `
                <td><strong>${user.name}</strong></td>
                <td>${user.email}</td>
                <td>${dateStr}</td>
                <td>${user.interactions} message(s)</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function processSchemes(messages) {
        const tbody = document.getElementById('schemes-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        const schemeMessages = messages.filter(msg => {
            const formType = (msg.form_type || '').toUpperCase();
            // Match the previous 'scheme_interest' backward compatibility as well as new 'SCHEME_INTEREST'
            return formType === 'SCHEME_INTEREST' || formType === 'SCHEME';
        });

        schemeMessages.forEach(msg => {
            const tr = document.createElement('tr');
            
            // Format Date
            const dateObj = new Date(msg.timestamp);
            const dateStr = isNaN(dateObj.getTime()) ? 'Unknown Date' : 
                            (dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
            
            const schemeName = msg.schemeName || 'Unknown Scheme';
            const schemeType = msg.schemeType || 'N/A';
            const schemeState = msg.schemeState || 'N/A';
            
            // Re-use badge class logic based on type (for visual similarity)
            let typeBadgeClass = 'badge-other';
            if (schemeType.toLowerCase().includes('financial')) typeBadgeClass = 'badge-contact';
            if (schemeType.toLowerCase().includes('insurance') || schemeType.toLowerCase().includes('irrigation')) typeBadgeClass = 'badge-scheme';

            tr.innerHTML = `
                <td>${dateStr}</td>
                <td><strong>${msg.name || 'Unknown'}</strong></td>
                <td>${msg.email || 'N/A'}</td>
                <td>${schemeName}</td>
                <td><span class="badge ${typeBadgeClass}">${schemeType}</span></td>
                <td>${schemeState}</td>
            `;
            tbody.appendChild(tr);
        });
    }
});
