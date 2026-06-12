// session.js
// Handles global authentication state and UI updates across all pages.

document.addEventListener('DOMContentLoaded', () => {
    updateNavbarState();
    
    // Listen for custom login/logout events to update UI immediately
    window.addEventListener('karsakah_login', updateNavbarState);
    window.addEventListener('karsakah_logout', () => {
        updateNavbarState();
        // Redirect to home if on a protected page
        if (window.location.pathname.endsWith('profile.html')) {
            window.location.href = 'index.html';
        }
    });
});

window.logoutUser = function(e) {
    if (e) e.preventDefault();
    localStorage.removeItem('karsakah_user');
    window.dispatchEvent(new Event('karsakah_logout'));
    window.location.reload();
};

function updateNavbarState() {
    const userStr = localStorage.getItem('karsakah_user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    // Find navbar profile elements
    const desktopProfileMenus = document.querySelectorAll('.right-nav .profile-menu');
    const mobileProfileMenus = document.querySelectorAll('.right-nav-mobile .profile-menu');
    
    const allProfileMenus = [...desktopProfileMenus, ...mobileProfileMenus];
    
    if (user) {
        // User is logged in
        allProfileMenus.forEach(menu => {
            menu.style.display = 'flex'; // Ensure profile menu is shown
            
            // Update Avatar initials
            const initials = getInitials(user.name);
            const avatar = menu.querySelector('.avatar');
            if (avatar) avatar.innerText = initials;
            
            // Update Name (desktop might hide it initially, mobile shows it)
            const nameEl = menu.querySelector('.profile-name');
            if (nameEl) nameEl.innerText = user.name;
            
            // Hook up logout button inside dropdown
            const logoutBtns = menu.querySelectorAll('a.danger');
            logoutBtns.forEach(btn => {
                btn.onclick = window.logoutUser;
            });
        });
        
        // Remove or hide any explicit "Login" links if they existed before this dynamic integration
        const explicitLoginBtns = document.querySelectorAll('.nav-login-btn');
        explicitLoginBtns.forEach(btn => btn.style.display = 'none');
        
    } else {
        // User is strictly NOT logged in
        
        // Hide profile dropdowns
        allProfileMenus.forEach(menu => {
            menu.style.display = 'none';
        });
        
        // Insert a Login button where the profile menu usually is, if not already there
        const rightNavs = document.querySelectorAll('.right-nav');
        rightNavs.forEach(nav => {
            if (!nav.querySelector('.nav-login-btn')) {
                const loginBtn = document.createElement('a');
                loginBtn.href = 'auth.html';
                loginBtn.className = 'btn btn-primary btn-sm nav-login-btn';
                loginBtn.innerHTML = '<i class="ph-bold ph-sign-in"></i> Log In';
                loginBtn.style.marginLeft = '12px';
                nav.appendChild(loginBtn);
            } else {
                nav.querySelector('.nav-login-btn').style.display = 'inline-flex';
            }
        });
        
        const mobileNavs = document.querySelectorAll('.right-nav-mobile');
        mobileNavs.forEach(nav => {
            if (!nav.querySelector('.nav-login-btn')) {
                const loginBtn = document.createElement('a');
                loginBtn.href = 'auth.html';
                loginBtn.className = 'btn btn-primary btn-sm w-100 nav-login-btn';
                loginBtn.innerHTML = '<i class="ph-bold ph-sign-in"></i> Log In';
                loginBtn.style.marginTop = '10px';
                nav.appendChild(loginBtn);
            } else {
                nav.querySelector('.nav-login-btn').style.display = 'block';
            }
        });
    }
}

function getInitials(name) {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name.substring(0, 2)).toUpperCase();
}
