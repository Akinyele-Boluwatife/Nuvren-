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

// Handle login form submit
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent page refresh

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Welcome back, ${data.name}!`); // Show success message
            document.getElementById('login-form').reset();
            window.location.href = '/admin';       // Redirect to admin page
        } else {
            alert(data.error);                     // Show error message
        }
    } catch (error) {
        alert('Error submitting form');
        console.error('Error:', error);
    }
});