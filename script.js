// Función para mostrar un reloj en tiempo real
function mostrarReloj() {
    const relojElemento = document.getElementById('reloj'); // Asegúrate de tener un <div id="reloj"> en tu HTML

    function actualizarHora() {
        const ahora = new Date();
        let horas = ahora.getHours();
        let minutos = ahora.getMinutes();
        let segundos = ahora.getSeconds();

        // Formato de dos dígitos para minutos y segundos
        minutos = minutos < 10 ? '0' + minutos : minutos;
        segundos = segundos < 10 ? '0' + segundos : segundos;

        // Opcional: Formato de 12 horas con AM/PM
        const ampm = horas >= 12 ? 'PM' : 'AM';
        horas = horas % 12;
        horas = horas ? horas : 12; // La hora '0' debe ser '12'

        const tiempoActual = `${horas}:${minutos}:${segundos} ${ampm}`;
        relojElemento.textContent = tiempoActual;
    }

    // Actualizar el reloj cada segundo
    setInterval(actualizarHora, 1000);
    actualizarHora(); // Llamar una vez para mostrar la hora inmediatamente
}

// Función para obtener y mostrar la fecha actual
function mostrarFechaActual() {
    const fechaElemento = document.getElementById('fecha'); // Asegúrate de tener un <div id="fecha"> en tu HTML
    if (fechaElemento) {
        const ahora = new Date();
        const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        fechaElemento.textContent = ahora.toLocaleDateString('es-ES', opcionesFecha);
    }
}

// Función para mostrar un mensaje personalizado de bienvenida según la hora del día
function mostrarSaludoPersonalizado(idElementoSaludo) {
    const saludoElemento = document.getElementById(idElementoSaludo);
    if (saludoElemento) {
        const ahora = new Date();
        const hora = ahora.getHours();
        let mensajeSaludo;

        if (hora >= 5 && hora < 12) {
            mensajeSaludo = "¡Buenos días! BIENVENIDO A...";
        } else if (hora >= 12 && hora < 19) {
            mensajeSaludo = "¡Buenas tardes! BIENVENIDO A...";
        } else {
            mensajeSaludo = "¡Buenas noches! BIENVENIDO A...";
        }
        saludoElemento.textContent = mensajeSaludo;
    }
}