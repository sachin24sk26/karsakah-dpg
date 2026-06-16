document.addEventListener('DOMContentLoaded', () => {
    const themeCheckbox = document.getElementById('theme-checkbox');
    const themeCheckboxMobile = document.getElementById('theme-checkbox-mobile');
    const root = document.documentElement;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkInitial = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    function setTheme(isDark) {
        if (isDark) {
            root.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
        if (themeCheckbox) themeCheckbox.checked = isDark;
        if (themeCheckboxMobile) themeCheckboxMobile.checked = isDark;
    }

    if (isDarkInitial) {
        setTheme(true);
    }
    
    const handleThemeChange = (e) => {
        setTheme(e.target.checked);
    };

    if (themeCheckbox) {
        themeCheckbox.addEventListener('change', handleThemeChange);
    }
    
    if (themeCheckboxMobile) {
        themeCheckboxMobile.addEventListener('change', handleThemeChange);
    }
});

// Global UI Interactivity Functions
window.toggleProfileMenu = function(event) {
    event.stopPropagation();
    const menu = event.currentTarget;
    menu.classList.toggle('open');
};

window.toggleMobileMenu = function() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
};

// Close dropdowns when clicking outside
document.addEventListener('click', (event) => {
    const profileMenu = document.querySelector('.profile-menu');
    if (profileMenu && profileMenu.classList.contains('open') && !profileMenu.contains(event.target)) {
        profileMenu.classList.remove('open');
    }
});


window.toggleInfoMenu = function(event) {
    event.stopPropagation();
    const dropdown = event.currentTarget.querySelector('.info-dropdown');
    const isVisible = dropdown.style.display === 'flex';
    document.querySelectorAll('.info-dropdown, .profile-dropdown').forEach(d => {
        if (d) d.style.display = 'none';
    });
    if (!isVisible) {
        dropdown.style.display = 'flex';
    }
};

// Update the close dropdowns listener
const oldClickListener = document.addEventListener('click', (event) => {
    document.querySelectorAll('.info-dropdown, .profile-dropdown').forEach(d => {
        if (d) d.style.display = 'none';
    });
});
