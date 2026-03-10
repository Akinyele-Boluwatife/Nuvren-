// Toggle password visibility for password field
document.getElementById('toggle-password').addEventListener('click', function(e) {
    e.preventDefault();
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        this.textContent = 'Show';
    }
});

// Toggle password visibility for confirm password field
document.getElementById('toggle-confirm-password').addEventListener('click', function(e) {
    e.preventDefault();
    const confirmPasswordInput = document.getElementById('confirm-password');
    if (confirmPasswordInput.type === 'password') {
        confirmPasswordInput.type = 'text';
        this.textContent = 'Hide';
    } else {
        confirmPasswordInput.type = 'password';
        this.textContent = 'Show';
    }
});
document.getElementById('signup-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent page refresh

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);               // Show success message
            document.getElementById('signup-form').reset(); // Clear form
            window.location.href = '/login';   // Redirect to login page
        } else {
            alert(data.error);                 // Show error message (like email exists)
        }
    } catch (error) {
        alert('Error submitting form');
        console.error('Error:', error);
    }
});