function switchLoginForm() {
    // Get the login and signin form elements by their IDs
    const loginForm = document.getElementById('login');
    const signinForm = document.getElementById('signin');
    
    // Show the login form and hide the signin form
    loginForm.classList.remove('hidden');
    signinForm.classList.add('hidden');
}

function switchSigninForm() {
    // Get the login and signin form elements by their IDs
    const loginForm = document.getElementById('login');
    const signinForm = document.getElementById('signin');
    
    // Show the signin form and hide the login form
    signinForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', function() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Get the target input field
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            
            // Toggle between password and text type
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                // Change to "hide" icon
                this.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                `;
            } else {
                passwordInput.type = 'password';
                // Change back to "show" icon
                this.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                `;
            }
        });
    });

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove all non-digit characters
            let value = this.value.replace(/\D/g, '');
            
            // Apply the phone number format
            if (value.length > 0) {
                if (value.length <= 3) {
                    this.value = value;
                } else if (value.length <= 7) {
                    this.value = value.slice(0, 3) + '-' + value.slice(3);
                } else {
                    this.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
                }
            }
            
            if (value.length > 12) {
                this.value = this.value.substring(0, 15); // Account for 2 hyphens
            }
        });
    }
    
});
