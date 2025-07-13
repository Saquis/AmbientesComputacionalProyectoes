// app.js

const registerModal = document.getElementById('register-modal');
const openRegisterBtn = document.getElementById('open-register');
const closeBtn = document.querySelector('.close');

openRegisterBtn.addEventListener('click', () => {
    registerModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    registerModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === registerModal) {
        registerModal.style.display = 'none';
    }
});

// Función para login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message); // Mostrar mensaje de bienvenida
        localStorage.setItem('token', data.token); // Guardar token en LocalStorage
        window.location.href = 'main.html'; // Redirigir a la página principal
    } else {
        alert(data.error); // Mostrar error si las credenciales no son correctas
    }
});

// Registro de usuario
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('register-nombre').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message);
        registerModal.style.display = 'none'; // Cerrar modal después del registro
    } else {
        alert(data.error);
    }
});
