// auth.js

document.addEventListener('DOMContentLoaded', () => {
    // If user is already logged in, redirect to profile
    if (localStorage.getItem('karsakah_user')) {
        window.location.href = 'profile.html';
        return;
    }
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Setup login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const btn = document.getElementById('login-btn');
            const btnText = btn.querySelector('span');
            const spinner = document.getElementById('login-spinner');
            
            // UI State
            btn.disabled = true;
            btnText.style.display = 'none';
            spinner.classList.remove('hidden');
            hideAlert();
            
            try {
                const response = await fetch('http://127.0.0.1:5000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    showAlert('success', 'Login successful! Redirecting...');
                    // Store user data in localStorage
                    localStorage.setItem('karsakah_user', JSON.stringify(data.user));
                    
                    // Dispatch custom event for session.js to pick up immediately
                    window.dispatchEvent(new Event('karsakah_login'));
                    
                    setTimeout(() => {
                        window.location.href = 'profile.html';
                    }, 1000);
                } else {
                    showAlert('error', data.error || 'Invalid credentials');
                }
            } catch (err) {
                console.error("Login Error:", err);
                showAlert('error', 'Network error. Please try again.');
            } finally {
                btn.disabled = false;
                btnText.style.display = 'inline';
                spinner.classList.add('hidden');
            }
        });
    }
    
    // Setup register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const phone = document.getElementById('reg-phone').value;
            const password = document.getElementById('reg-password').value;
            
            const btn = document.getElementById('reg-btn');
            const btnText = btn.querySelector('span');
            const spinner = document.getElementById('reg-spinner');
            
            if (password.length < 6) {
                showAlert('error', 'Password must be at least 6 characters long.');
                return;
            }
            
            // UI State
            btn.disabled = true;
            btnText.style.display = 'none';
            spinner.classList.remove('hidden');
            hideAlert();
            
            try {
                const response = await fetch('http://127.0.0.1:5000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, password })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    showAlert('success', 'Account created successfully! Redirecting...');
                    
                    // Automatically log in the user after registration
                    localStorage.setItem('karsakah_user', JSON.stringify(data.user));
                    
                    // Dispatch custom event
                    window.dispatchEvent(new Event('karsakah_login'));
                    
                    setTimeout(() => {
                        window.location.href = 'profile.html';
                    }, 1500);
                } else {
                    showAlert('error', data.error || 'Registration failed');
                }
            } catch (err) {
                console.error("Registration Error:", err);
                showAlert('error', 'Network error. Please try again.');
            } finally {
                btn.disabled = false;
                btnText.style.display = 'inline';
                spinner.classList.add('hidden');
            }
        });
    }
});

// Tab switching logic
window.switchTab = function(tab) {
    const loginTabElement = document.getElementById('tab-login');
    const registerTabElement = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    
    hideAlert();
    
    if (tab === 'login') {
        loginTabElement.classList.add('active');
        registerTabElement.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        title.innerText = 'Welcome Back';
        subtitle.innerText = 'Log in to your agricultural dashboard';
    } else {
        loginTabElement.classList.remove('active');
        registerTabElement.classList.add('active');
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        title.innerText = 'Create an Account';
        subtitle.innerText = 'Join KARSAKAH today';
    }
};

function showAlert(type, message) {
    const alertBox = document.getElementById('auth-alert');
    alertBox.className = `auth-alert ${type}`;
    
    const icon = type === 'success' ? 'ph-check-circle' : 'ph-warning-circle';
    alertBox.innerHTML = `<i class="ph-bold ${icon}"></i> <span>${message}</span>`;
}

function hideAlert() {
    const alertBox = document.getElementById('auth-alert');
    alertBox.className = 'auth-alert hidden';
}
