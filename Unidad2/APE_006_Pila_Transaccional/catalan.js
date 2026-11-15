// Catalan.js
function catalan(n) {
    // C_n = (1/(n+1)) * binom(2n, n)
    let binom = 1;
    for (let i = 1; i <= n; i++) {
        binom = (binom * (n + i)) / i; // binom(2n, n) incremental
    }
    return Math.round(binom / (n + 1));
}

function contarSecuenciasValidas(n) {
    // Genera todas las secuencias de n push (1) y n pop (0)
    // y cuenta las que nunca dejan la pila con tamaño negativo.
    let total = 0;
    const secuencia = new Array(2 * n).fill(0);

    function backtrack(pos, pusheados, tamPila) {
        if (pos === 2 * n) { total++; return; }
        if (pusheados < n) backtrack(pos + 1, pusheados + 1, tamPila + 1);
        if (tamPila > 0) backtrack(pos + 1, pusheados, tamPila - 1);
    }

    backtrack(0, 0, 0);
    return total;
}

for (let n = 1; n <= 8; n++) {
    const empirico = contarSecuenciasValidas(n);
    const teorico = catalan(n);
    console.log(`n=${n}  empírico=${empirico}  Catalan C_${n}=${teorico}  ${empirico === teorico ? 'OK' : 'FALLA'}`);
}
