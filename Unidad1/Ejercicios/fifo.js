// Simulación de una cola FIFO (First In, First Out)
let cola = [];

// Función para encolar (agregar al final)
function encolar(elemento) {
    cola.push(elemento);
    console.log(`Encolado: "${elemento}" -> Cola actual: [${cola}]`);
}

// Función para desencolar (quitar el primero)
function desencolar() {
    if (cola.length === 0) {
        console.log("La cola está vacía, no se puede desencolar.");
        return null;
    }
    const primero = cola.shift(); // shift() quita el primer elemento
    console.log(`Desencolado: "${primero}" -> Cola actual: [${cola}]`);
    return primero;
}

// --- Probemos con un ejemplo de la vida real: una fila en el supermercado ---

console.log("=== Simulación de fila en el supermercado ===\n");

encolar("Cliente 1");
encolar("Cliente 2");
encolar("Cliente 3");

console.log("\n--- Ahora atendemos (desencolamos) ---\n");

desencolar(); // Sale el Cliente 1 (el primero que llegó)
desencolar(); // Sale el Cliente 2
desencolar(); // Sale el Cliente 3
desencolar(); // Intento desencolar con la cola vacía
