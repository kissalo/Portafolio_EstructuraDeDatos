
const NodoDoble = require('./NodoDoble');

/**
 * Estructura de datos dinámica para la gestión de navegación bidireccional.
 */
class ListaDobleNavegacion {
    constructor() {
    this.cabeza = null;
    this.cola = null;
    this.actual = null; // Puntero/Cursor de navegación activa
    this.longitud = 0;
    }

/**
   * Inserta un nuevo registro al final de la lista. Complejidad: O(1)
   * @param {Object} dato - Registro a almacenar.
   * @returns {NodoDoble} El nodo creado.
   */
    insertar(dato) {
        const nuevoNodo = new NodoDoble(dato);

        if (!this.cabeza) {
            this.cabeza = nuevoNodo;
            this.cola = nuevoNodo;
            this.actual = nuevoNodo;
        } else {
            this.cola.siguiente = nuevoNodo;
            nuevoNodo.anterior = this.cola;
            this.cola = nuevoNodo;
        }

        this.longitud++;
        return nuevoNodo;
    }

    /**
     * Desplaza el cursor activo hacia el siguiente nodo. Complejidad: O(1)
     * @returns {Object|null} El dato del nuevo nodo activo o null si alcanza el final.
     */
    avanzar() {
        if (this.actual && this.actual.siguiente) {
        this.actual = this.actual.siguiente;
        return this.actual.dato;
        }
        return null;
    }

    /**
     * Desplaza el cursor activo hacia el nodo anterior. Complejidad: O(1)
     * @returns {Object|null} El dato del nuevo nodo activo o null si alcanza el inicio.
     */
    retroceder() {
        if (this.actual && this.actual.anterior) {
        this.actual = this.actual.anterior;
        return this.actual.dato;
        }
        return null;
    }


}

