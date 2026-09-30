/**
 * navbar.js — Shared KARSAKAH navbar injector
 * Replaces the <header class="navbar"> content on every page.
 * This ensures consistent navbar, mobile menu, and dropdown across all pages.
 */
(function () {
    // Determine active page
    const path = window.location.pathname.split('/').pop() || 'index.html';

    function isActive(href) {
        return path === href ? 'active' : '';
    }

    const navbarEl = document.querySelector('header.navbar');
    if (!navbarEl) return;

    navbarEl.innerHTML = `
        <a href="index.html" class="logo" aria-label="KARSAKAH Home">
            <img src="assets/karsakah-logo.png" alt="KARSAKAH" class="logo-img">
        </a>

        <button class="mobile-menu-btn" aria-label="Open menu" onclick="KNav.toggle()">
            <i class="ph-bold ph-list"></i>
        </button>

        <nav class="nav-links" id="knav-links" aria-label="Main navigation">
            <button class="mobile-close-btn" aria-label="Close menu" onclick="KNav.toggle()">
                <i class="ph-bold ph-x"></i>
            </button>

            <a href="index.html" class="${isActive('index.html')}"><i class="ph-bold ph-house"></i> Home</a>
            <a href="advisory.html" class="${isActive('advisory.html')}"><i class="ph-bold ph-plant"></i> Advisory</a>
            <a href="crop_id.html" class="${isActive('crop_id.html')}"><i class="ph-bold ph-scan"></i> Crop Doctor</a>
            <a href="network.html" class="${isActive('network.html')}"><i class="ph-bold ph-globe"></i> BRICS Hub</a>
            <a href="implementation.html" class="${isActive('implementation.html')}" style="color: var(--primary-green); font-weight: 700;"><i class="ph-bold ph-kanban"></i> Track 4 Roadmap</a>

            <div class="info-menu" role="button" tabindex="0" aria-haspopup="true"
                 onclick="KNav.toggleDropdown(event)"
                 onkeypress="if(event.key==='Enter')KNav.toggleDropdown(event)">
                <i class="ph-bold ph-dots-three-outline-vertical"></i>
                <span>More</span>
                <i class="ph-bold ph-caret-down" style="font-size:11px; margin-left:2px;"></i>
                <div class="info-dropdown" id="knav-dropdown" role="menu">
                    <div style="padding:6px 14px 4px; font-size:11px; text-transform:uppercase; letter-spacing:0.6px; color:var(--text-gray); font-weight:700;">Smallholder Utilities</div>
                    <a href="prices.html" role="menuitem" class="${isActive('prices.html')}"><i class="ph-bold ph-currency-inr"></i> Market Prices</a>
                    <a href="weather.html" role="menuitem" class="${isActive('weather.html')}"><i class="ph-bold ph-cloud-sun"></i> Weather Forecast</a>
                    <a href="schemes.html" role="menuitem" class="${isActive('schemes.html')}"><i class="ph-bold ph-newspaper"></i> Gov Schemes</a>
                    <a href="market/mandi.html" role="menuitem" target="_blank"><i class="ph-bold ph-storefront"></i> Mandi Market</a>
                    <a href="rental/templates/index.html" role="menuitem" target="_blank"><i class="ph-bold ph-tractor"></i> Equipment Rental</a>
                    <a href="news.html" role="menuitem" class="${isActive('news.html')}"><i class="ph-bold ph-article"></i> Agri News</a>
                    <div style="border-top:1px solid var(--border-color); margin:4px 0;"></div>
                    <a href="about.html" role="menuitem" class="${isActive('about.html')}"><i class="ph-bold ph-info"></i> About</a>
                    <a href="faq.html" role="menuitem" class="${isActive('faq.html')}"><i class="ph-bold ph-question"></i> FAQs</a>
                    <a href="contacts.html" role="menuitem" class="${isActive('contacts.html')}"><i class="ph-bold ph-phone"></i> Contact</a>
                </div>
            </div>

            <!-- Mobile-only bottom controls -->
            <div class="right-nav-mobile">
                <div class="language-selector" style="width:100%">
                    <i class="ph-bold ph-translate"></i>
                    <select class="lang-select" aria-label="Select language" id="lang-select-mobile">
                        <option value="en">English</option>
                        <option value="hi">हिन्दी</option>
                        <option value="mr">मराठी</option>
                        <option value="pa">ਪੰਜਾਬੀ</option>
                        <option value="bn">বাংলা</option>
                        <option value="te">తెలుగు</option>
                        <option value="ta">தமிழ்</option>
                        <option value="kn">ಕನ್ನಡ</option>
                        <option value="ml">മലയാളം</option>
                        <option value="ur">اردو</option>
                    </select>
                </div>
                <label class="switch" aria-label="Toggle dark mode">
                    <input type="checkbox" id="theme-checkbox-mobile">
                    <span class="slider"></span>
                </label>
                <div class="profile-menu" onclick="KNav.toggleProfile(event)">
                    <div class="avatar" id="knav-avatar-mobile">AS</div>
                    <span class="profile-name" id="knav-name-mobile">My Account</span>
                    <div class="profile-dropdown">
                        <a href="profile.html"><i class="ph-bold ph-user"></i> Dashboard</a>
                        <a href="profile.html"><i class="ph-bold ph-gear"></i> Settings</a>
                        <a href="#" class="danger"><i class="ph-bold ph-sign-out"></i> Log Out</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Desktop right controls -->
        <div class="right-nav">
            <div class="language-selector">
                <i class="ph-bold ph-translate"></i>
                <select class="lang-select" aria-label="Select language" id="lang-select-desktop">
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="mr">मराठी</option>
                    <option value="pa">ਪੰਜਾਬੀ</option>
                    <option value="bn">বাংলা</option>
                    <option value="te">తెలుగు</option>
                    <option value="ta">தமிழ்</option>
                    <option value="kn">ಕನ್ನಡ</option>
                    <option value="ml">മലയാളം</option>
                    <option value="ur">اردو</option>
                </select>
            </div>
            <label class="switch" aria-label="Toggle dark mode">
                <input type="checkbox" id="theme-checkbox">
                <span class="slider"></span>
            </label>
            <div class="profile-menu" onclick="KNav.toggleProfile(event)">
                <div class="avatar" id="knav-avatar">AS</div>
                <span class="profile-name" id="knav-name">User</span>
                <div class="profile-dropdown" id="profileDropdown">
                    <a href="profile.html"><i class="ph-bold ph-user"></i> Dashboard</a>
                    <a href="profile.html"><i class="ph-bold ph-gear"></i> Settings</a>
                    <a href="profile.html"><i class="ph-bold ph-clock-counter-clockwise"></i> History</a>
                    <a href="#" class="danger"><i class="ph-bold ph-sign-out"></i> Log Out</a>
                </div>
            </div>
        </div>
    `;

    // Inject backdrop if not already present
    if (!document.getElementById('knav-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.id = 'knav-backdrop';
        backdrop.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:400;backdrop-filter:blur(3px);';
        backdrop.onclick = KNav.toggle;
        document.body.appendChild(backdrop);
    }

    // Sync language selects
    const selects = document.querySelectorAll('.lang-select');
    selects.forEach(sel => {
        sel.addEventListener('change', function () {
            const val = this.value;
            selects.forEach(s => s.value = val);
            // Trigger translate.js if present
            if (window.applyTranslation) window.applyTranslation(val);
        });
    });
})();

// ─── KNav: global nav controller ───────────────────────────────────────────
window.KNav = {
    toggle() {
        const nav = document.getElementById('knav-links');
        const backdrop = document.getElementById('knav-backdrop');
        const isOpen = nav.classList.toggle('active');
        if (backdrop) backdrop.style.display = isOpen ? 'block' : 'none';
        document.body.style.overflow = isOpen ? 'hidden' : '';
    },

    toggleDropdown(e) {
        e.stopPropagation();
        const dropdown = document.getElementById('knav-dropdown');
        if (!dropdown) return;
        const isOpen = dropdown.style.display === 'flex';
        KNav.closeAll();
        if (!isOpen) {
            dropdown.style.display = 'flex';
            dropdown.style.flexDirection = 'column';
        }
    },

    toggleProfile(e) {
        e.stopPropagation();
        const menu = e.currentTarget;
        const wasOpen = menu.classList.contains('open');
        KNav.closeAll();
        if (!wasOpen) menu.classList.add('open');
    },

    closeAll() {
        document.querySelectorAll('.info-dropdown').forEach(d => d.style.display = 'none');
        document.querySelectorAll('.profile-menu').forEach(m => m.classList.remove('open'));
    }
};

document.addEventListener('click', KNav.closeAll);

// ─── Backward compatibility: pages that call toggleMobileMenu / toggleInfoMenu ─
window.toggleMobileMenu = KNav.toggle.bind(KNav);
window.toggleInfoMenu = KNav.toggleDropdown.bind(KNav);
window.toggleProfileMenu = KNav.toggleProfile.bind(KNav);
