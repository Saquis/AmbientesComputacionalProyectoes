document.getElementById('busqueda-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const especie = document.getElementById('especie').value.trim() || undefined;
    const raza = document.getElementById('raza').value.trim() || undefined;
    const edad = parseInt(document.getElementById('edad').value) || undefined;
    const genero = document.getElementById('genero').value.trim() || undefined;
    const busca = document.getElementById('busca').value.trim() || undefined;
    const likes = parseInt(document.getElementById('likes').value) || undefined;

    const queryParams = new URLSearchParams();

    // Agregar solo los parámetros que no sean undefined
    if (especie) queryParams.append('especie', especie);
    if (raza) queryParams.append('raza', raza);
    if (!isNaN(edad)) queryParams.append('edad', edad);
    if (genero) queryParams.append('genero', genero);
    if (busca) queryParams.append('busca', busca);
    if (!isNaN(likes)) queryParams.append('likes', likes);

    try {
        const response = await fetch(`http://localhost:3000/api/mascotas_query?${queryParams.toString()}`);
        
        if (response.ok) {
            const resultados = await response.json();
            mostrarResultados(resultados);
        } else {
            console.error('Error al realizar la búsqueda');
        }
    } catch (error) {
        console.error('Error en la conexión:', error);
    }
});

function mostrarResultados(mascotas) {
    const resultadosDiv = document.getElementById('resultados-busqueda');
    resultadosDiv.innerHTML = ''; // Limpiar resultados anteriores

    if (mascotas.length === 0) {
        resultadosDiv.innerHTML = '<p>No se encontraron mascotas que coincidan con la búsqueda.</p>';
        return;
    }

    mascotas.forEach(mascota => {
        const div = document.createElement('div');
        div.classList.add('mascota');

        div.innerHTML = `
            <h3>${mascota.nombre}</h3>
            <p>Especie: ${mascota.especie}</p>
            <p>Raza: ${mascota.raza}</p>
            <p>Edad: ${mascota.edad}</p>
            <p>Género: ${mascota.genero}</p>
            <p>Descripción: ${mascota.descripcion}</p>
            <p>Busca: ${mascota.busca}</p>
            <p>Likes: ${mascota.likes}</p>
            <img src="${mascota.fotos[0]}" alt="${mascota.nombre}" style="width: 100px; height: auto;" />
        `;
        resultadosDiv.appendChild(div);
    });
}
