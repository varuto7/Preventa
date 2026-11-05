// Inicializar datos en la memoria del navegador o cargar los existentes
let clientes = JSON.parse(localStorage.getItem('pepsi_clientes')) || [
    { id: 1, nombre: 'Bar "El Rincón"', categoria: 'A+', pedido: 5, estado: 'Pendiente recepción' }
];

// Función para guardar cambios en localStorage y actualizar la vista
function actualizarApp() {
    localStorage.setItem('pepsi_clientes', JSON.stringify(clientes));
    renderizarTodo();
}

// 1. Guardar un nuevo cliente
function guardarCliente() {
    const nombreInput = document.getElementById('nombreCliente');
    const catInput = document.getElementById('categoriaCliente');

    if (!nombreInput.value.trim()) {
        alert("Por favor, introduce el nombre del cliente.");
        return;
    }

    const nuevoCliente = {
        id: Date.now(),
        nombre: nombreInput.value.trim(),
        categoria: catInput.value,
        pedido: 0,
        estado: 'Sin pedido'
    };

    clientes.push(nuevoCliente);
    nombreInput.value = '';
    actualizarApp();
    alert("¡Cliente guardado correctamente!");
}

// 2. Registrar un pedido para un cliente
function registrarPedido() {
    const selectId = document.getElementById('selectClientePedido').value;
    const unidades = document.getElementById('unidadesPedido').value;

    if (!selectId || !unidades) {
        alert("Selecciona un cliente y añade la cantidad de cajas.");
        return;
    }

    const cliente = clientes.find(c => c.id == selectId);
    if (cliente) {
        cliente.pedido = parseInt(unidades);
        cliente.estado = 'Pendiente recepción';
        actualizarApp();
        document.getElementById('unidadesPedido').value = '';
        alert(`Pedido de ${unidades} cajas registrado para ${cliente.nombre}. Queda pendiente de entrega.`);
    }
}

// 3. Simular la visita del día siguiente (Confirmar OK o registrar Incidencia)
function verificarVisita(idCliente, tipo) {
    const cliente = clientes.find(c => c.id == idCliente);
    if (!cliente) return;

    if (tipo === 'ok') {
        cliente.estado = 'Entregado OK (Sin incidencias)';
        alert(`✅ Visita realizada a ${cliente.nombre}: Recuento visual correcto. Pedido dado por bueno.`);
    } else {
        cliente.estado = 'Incidencia registrada';
        alert(`⚠️ Incidencia marcada en ${cliente.nombre}. Queda registrado para revisión.`);
    }
    actualizarApp();
}

// Renderizar toda la interfaz en pantalla
function renderizarTodo() {
    // Actualizar selector de clientes en el formulario de pedidos
    const select = document.getElementById('selectClientePedido');
    select.innerHTML = '<option value="">Selecciona un cliente...</option>';
    
    // Contenedor del listado de ruta
    const contenedorLista = document.getElementById('listaClientes');
    contenedorLista.innerHTML = '';

    if (clientes.length === 0) {
        contenedorLista.innerHTML = '<p style="color:#777; text-align:center;">No hay clientes registrados.</p>';
        return;
    }

    clientes.forEach(c => {
        // Rellenar select
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = `${c.nombre} (${c.categoria})`;
        select.appendChild(option);

        // Crear tarjeta visual de cliente en ruta
        const div = document.createElement('div');
        div.className = 'client-item';
        div.innerHTML = `
            <strong>${c.nombre}</strong> [${c.categoria}]<br>
            <small>📦 Pedido actual: <b>${c.pedido > 0 ? c.pedido + ' cajas' : 'Ninguno'}</b></small><br>
            <small>📌 Estado: <span style="color: ${c.estado.includes('OK') ? 'green' : (c.estado.includes('Incidencia') ? 'red' : '#004b93')}">${c.estado}</span></small>
            <div class="client-actions">
                <button onclick="verificarVisita(${c.id}, 'ok')">✔ Todo OK (Recuento)</button>
                <button class="btn-incidencia" onclick="verificarVisita(${c.id}, 'incidencia')">❌ Incidencia</button>
            </div>
        `;
        contenedorLista.appendChild(div);
    });
}

// Cargar la vista al iniciar la página
window.onload = function() {
    renderizarTodo();
};
