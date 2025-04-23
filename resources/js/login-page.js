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
            if (passwordInput.type == 'password') {
                passwordInput.type = 'text';
                // Change to "hide" icon
                this.innerHTML = `
                    <img src="assets/icons/crossed-eye.svg" alt="Toggle Password Visibility" class="h-5 w-5 text-gray-500">
                `;
            } else {
                passwordInput.type = 'password';
                // Change back to "show" icon
                this.innerHTML = `
                    <img src="assets/icons/eye.svg" alt="Toggle Password Visibility" class="h-5 w-5 text-gray-500">
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
