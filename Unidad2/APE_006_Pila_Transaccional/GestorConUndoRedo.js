// GestorConUndoRedo.js
const { PilaTransaccional } = require('./PilaTransaccional');

class GestorConUndoRedo {
    constructor(datosIniciales) {
        this.registros = [...datosIniciales].sort((a, b) => a.watts - b.watts);
        this.pilaDeshacer = new PilaTransaccional();
        this.pilaRehacer = new PilaTransaccional();
    }

    actualizar(indice, nuevoWatts) {
        const anterior = this.registros[indice].watts;
        this.registros[indice].watts = nuevoWatts;
        this.pilaDeshacer.push(indice, anterior, nuevoWatts, 'TX');
        // Toda operación nueva invalida el futuro: se vacía la pila de rehacer
        while (!this.pilaRehacer.estaVacia()) this.pilaRehacer.pop();
    }

    deshacer() {
        const d = this.pilaDeshacer.pop();
        if (!d) return false;
        this.registros[d.indice].watts = d.estadoAnterior;
        // Se apila el inverso para poder rehacer
        this.pilaRehacer.push(d.indice, d.estadoNuevo, d.estadoAnterior, d.loteId);
        return true;
    }

    rehacer() {
        const d = this.pilaRehacer.pop();
        if (!d) return false;
        this.registros[d.indice].watts = d.estadoAnterior;
        this.pilaDeshacer.push(d.indice, d.estadoNuevo, d.estadoAnterior, d.loteId);
        return true;
    }
}
