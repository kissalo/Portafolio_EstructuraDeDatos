/**
 * Demo: Biblioteca con listas dobles de navegación + gestión de memoria / Garbage Collector.
 *
 * Ejecutar (IMPORTANTE la bandera para poder forzar el GC):
 *   node --expose-gc index.js
 */
const fs = require('fs');
const path = require('path');
const ListaDobleNavegacion = require('./ListaDobleNavegacion');

// ---------- Utilidades ----------
const heapMB = () => (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB';
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const titulo = (t) => console.log(`\n=== ${t} ===`);

function forzarGC() {
  if (typeof global.gc !== 'function') {
    console.log('  (!) Ejecuta con: node --expose-gc index.js para forzar el GC');
    return false;
  }
  global.gc();
  return true;
}

// FinalizationRegistry: avisa cuando el GC realmente libera un objeto.
const registro = new FinalizationRegistry((tituloLibro) => {
  console.log(`  [GC] Nodo recolectado de memoria -> "${tituloLibro}"`);
});

// ---------- 1. Cargar biblioteca desde JSON (módulo fs, sin APIs externas) ----------
titulo('1. Carga del archivo libros.json');
const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'libros.json'), 'utf-8'));
console.log(`Biblioteca: ${datos.biblioteca}`);

// Una lista doble por cada categoría
const biblioteca = new Map();
for (const [categoria, libros] of Object.entries(datos.categorias)) {
  const lista = new ListaDobleNavegacion();
  libros.forEach((libro) => lista.insertar(libro));
  biblioteca.set(categoria, lista);
  console.log(`  - ${categoria}: ${lista.longitud} libros`);
}

// ---------- 2. Navegación bidireccional ----------
titulo('2. Navegación bidireccional (avanzar / retroceder)');
const programacion = biblioteca.get('Programación');
console.log('Actual      :', programacion.obtenerActual().titulo);
console.log('Avanzar     :', programacion.avanzar().titulo);
console.log('Avanzar     :', programacion.avanzar().titulo);
console.log('Retroceder  :', programacion.retroceder().titulo);
programacion.avanzar();
programacion.avanzar();
console.log('Avanzar al final ->', programacion.avanzar()); // null: no hay más

// ---------- 3. Eliminación + Garbage Collector ----------
titulo('3. Eliminación de un nodo y recolección por el GC');

// El nodo se maneja dentro de una función para que no quede ninguna
// referencia local viva al terminar (si no, el GC no podría liberarlo).
function eliminarConRastreo(lista) {
  const nodo = lista.actual;
  const nombre = nodo.dato.titulo;
  const ref = new WeakRef(nodo); // referencia débil: NO impide la recolección
  registro.register(nodo, nombre); // avisa cuando el GC lo libere
  console.log(`Eliminando: "${nombre}"`);
  lista.eliminarActual(); // rompe enlaces siguiente/anterior y mueve el cursor
  return ref;
}

const estadistica = biblioteca.get('Estadística');
const refDebil = eliminarConRastreo(estadistica);
console.log('Longitud de Estadística ahora:', estadistica.longitud);
console.log('¿Nodo aún en memoria antes del GC?:', refDebil.deref() !== undefined);

(async () => {
  await dormir(50);
  forzarGC();
  await dormir(100); // permite que corra el callback del FinalizationRegistry
  console.log('¿Nodo aún en memoria después del GC?:', refDebil.deref() !== undefined);

  // ---------- 4. Prueba de estrés: medir heap ----------
  titulo('4. Prueba de estrés: uso del heap (memoria)');
  const N = 200000;
  forzarGC();
  console.log('Heap inicial                 :', heapMB());

  const masiva = new ListaDobleNavegacion();
  for (let i = 0; i < N; i++) {
    masiva.insertar({
      id: i,
      titulo: `Libro ${i}`,
      detalle: `contenido-${i}-`.repeat(20), // texto único por libro
    });
  }
  console.log(`Heap con ${N} nodos insertados:`, heapMB());

  // Eliminamos TODOS los nodos con eliminarActual (O(1) cada uno)
  while (masiva.longitud > 0) masiva.eliminarActual();
  console.log('Longitud tras eliminar todo  :', masiva.longitud);
  console.log('Heap tras eliminar (sin GC)  :', heapMB());

  forzarGC();
  await dormir(100);
  console.log('Heap tras Garbage Collector  :', heapMB());

  // ---------- 5. Liberar una lista completa ----------
  titulo('5. Liberar una categoría completa');
  console.log('Heap antes de quitar "Emprendimiento":', heapMB());
  biblioteca.delete('Emprendimiento'); // se pierde la última referencia a la lista
  forzarGC();
  await dormir(100);
  console.log('Categorías restantes:', [...biblioteca.keys()].join(', '));
  console.log('Heap después                      :', heapMB());

  console.log('\nFin de la demostración.');
})();
