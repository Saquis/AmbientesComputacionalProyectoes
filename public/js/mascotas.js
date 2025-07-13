async function cargarMascotas() {
    try {
        const response = await fetch('http://localhost:3000/api/mascotas');
        const mascotas = await response.json();
        const mascotasGrid = document.getElementById('mascotas-grid');
        mascotasGrid.innerHTML = ''; // Limpiar la cuadrícula

        mascotas.forEach((mascota) => {
            const card = document.createElement('div');
            card.classList.add('mascota-card');

            card.innerHTML = `
                <img src="${mascota.fotos[0]}" alt="Imagen de ${mascota.nombre}">
                <h3>${mascota.nombre}</h3>
                <p>Especie: ${mascota.especie}</p>
                <p>Me gusta: <span class="likes-count">${mascota.likes || 0}</span></p>
                <button class="ver-mas">...</button>
                <button class="like-btn">❤️ Me gusta</button>
                <button class="editar-btn">✏️ Editar</button>
            `;

            // Evento para abrir el modal
            card.querySelector('.ver-mas').addEventListener('click', () => {
                mostrarDetallesMascota(mascota);
            });

            // Evento para dar "Me gusta"
            card.querySelector('.like-btn').addEventListener('click', async () => {
                await incrementarLikes(mascota._id);
                cargarMascotas(); // Volver a cargar las mascotas para actualizar el contador
            });

            card.querySelector('.editar-btn').addEventListener('click', () => {
                abrirModalEditar(mascota);
            });

            mascotasGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error al cargar las mascotas:', error);
    }
}

async function incrementarLikes(mascotaId) {
    try {
        const response = await fetch(`http://localhost:3000/api/mascotas/${mascotaId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al dar "Me gusta".');
        }

        alert('¡Me gusta registrado!'); // Confirmación de éxito
        cargarMascotas();
    } catch (error) {
        console.error('Error al incrementar los likes:', error);
        alert('No se pudo registrar el "Me gusta". Intenta nuevamente.');
    }
}

function mostrarDetallesMascota(mascota) {
    document.getElementById('modal-nombre').textContent = mascota.nombre;
    document.getElementById('modal-especie').textContent = mascota.especie;
    document.getElementById('modal-raza').textContent = mascota.raza;
    document.getElementById('modal-edad').textContent = mascota.edad;
    document.getElementById('modal-genero').textContent = mascota.genero;
    document.getElementById('modal-descripcion').textContent = mascota.descripcion;
    document.getElementById('modal-busca').textContent = mascota.busca;

    const modal = document.getElementById('mascotaModal');
    modal.style.display = 'block';

    modal.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Abrir modal para registrar mascotas
const mascotaModal = document.getElementById('mascota-modal');
const openMascotaModalBtn = document.getElementById('menu-mascotas'); // Asegúrate de tener un botón en tu menú
const closeMascotaModalBtn = document.getElementById('close-mascota-modal');

openMascotaModalBtn.addEventListener('click', () => {
    mascotaModal.style.display = 'block';
});

closeMascotaModalBtn.addEventListener('click', () => {
    mascotaModal.style.display = 'none';
});

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', (event) => {
    if (event.target === mascotaModal) {
        mascotaModal.style.display = 'none';
    }
});

// Registro de mascota
document.getElementById('mascota-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('mascota-nombre').value;
    const especie = document.getElementById('mascota-especie').value;
    const raza = document.getElementById('mascota-raza').value;
    const edad = parseInt(document.getElementById('mascota-edad').value);
    const genero = document.getElementById('mascota-genero').value;
    const descripcion = document.getElementById('mascota-descripcion').value;
    const busca = document.getElementById('mascota-busca').value;

    const fileInput = document.getElementById('mascota-foto');
    const file = fileInput.files[0];
    const formData = new FormData();

    formData.append('nombre', nombre);
    formData.append('especie', especie);
    formData.append('raza', raza);
    formData.append('edad', edad);
    formData.append('genero', genero);
    formData.append('descripcion', descripcion);
    formData.append('busca', busca);
    formData.append('foto', file);

    const response = await fetch('http://localhost:3000/api/mascotas', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    if (response.ok) {
        alert('Mascota registrada con éxito');
        cargarMascotas();
        mascotaModal.style.display = 'none'; // Cerrar modal
        // Aquí puedes volver a cargar las mascotas o hacer otra acción
    } else {
        alert(data.error);
    }
});

function abrirModalEditar(mascota) {
    document.getElementById('editar-mascota-id').value = mascota._id;
    document.getElementById('editar-nombre').value = mascota.nombre;
    document.getElementById('editar-especie').value = mascota.especie;
    document.getElementById('editar-raza').value = mascota.raza;
    document.getElementById('editar-edad').value = mascota.edad;
    document.getElementById('editar-genero').value = mascota.genero;
    document.getElementById('editar-descripcion').value = mascota.descripcion;
    document.getElementById('editar-busca').value = mascota.busca;

    const editarModal = document.getElementById('editar-mascota-modal');
    editarModal.style.display = 'block';

    document.getElementById('close-editar-modal').addEventListener('click', () => {
        editarModal.style.display = 'none';
    });
}

document.getElementById('editar-mascota-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('editar-mascota-id').value;
    const nombre = document.getElementById('editar-nombre').value;
    const especie = document.getElementById('editar-especie').value;
    const raza = document.getElementById('editar-raza').value;
    const edad = parseInt(document.getElementById('editar-edad').value);
    const genero = document.getElementById('editar-genero').value;
    const descripcion = document.getElementById('editar-descripcion').value;
    const busca = document.getElementById('editar-busca').value;
    const foto = document.getElementById('editar-foto').files[0];

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('especie', especie);
    formData.append('raza', raza);
    formData.append('edad', edad);
    formData.append('genero', genero);
    formData.append('descripcion', descripcion);
    formData.append('busca', busca);
    if (foto) formData.append('foto', foto);

    try {
        const response = await fetch(`http://localhost:3000/api/mascotas/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            alert('Mascota actualizada con éxito');
            document.getElementById('editar-mascota-modal').style.display = 'none';
            cargarMascotas();
        } else {
            const data = await response.json();
            alert(data.error);
        }
    } catch (error) {
        console.error('Error al actualizar la mascota:', error);
        alert('Error al actualizar la mascota.');
    }
});

// Llamada para cargar las mascotas al iniciar la página
cargarMascotas();