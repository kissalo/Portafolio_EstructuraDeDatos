const { PilaTransaccional } = require('./PilaTransaccional');

class GestorOrdenamientoTransaccional {
  constructor(datosIniciales) {
    // Copia profunda de cada objeto (para que las réplicas sean independientes)
    // y orden ascendente por watts.
    this.registros = datosIniciales
      .map(r => ({ ...r }))
      .sort((a, b) => a.watts - b.watts);
    this.pilaUndo = new PilaTransaccional();
  }

  /** Actualiza el valor en su posición y registra UN solo delta (sin desplazar). */
  actualizarConRegistroDelta(indiceObjetivo, nuevoWatts, loteId) {
    const valorPrevio = this.registros[indiceObjetivo].watts;
    this.pilaUndo.push(indiceObjetivo, valorPrevio, nuevoWatts, loteId);
    this.registros[indiceObjetivo].watts = nuevoWatts;
  }

  /** Estrategia A: Backtracking/Undo por lote en O(m), sin re-ordenar. */
  deshacerLoteTransaccional(loteId) {
    let operacionesRevertidas = 0;
    while (!this.pilaUndo.estaVacia() && this.pilaUndo.peek().loteId === loteId) {
      const delta = this.pilaUndo.pop();
      this.registros[delta.indice].watts = delta.estadoAnterior;
      operacionesRevertidas++;
    }
    return operacionesRevertidas;
  }

  /** Estrategia B: Re-procesamiento completo mediante ordenamiento O(N log N). */
  reprocesarOrdenamientoCompleto() {
    this.registros.sort((a, b) => a.watts - b.watts);
  }
}

module.exports = GestorOrdenamientoTransaccional;