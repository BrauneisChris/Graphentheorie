const fs = require("fs");

// Liest die Adjazenzmatrix aus einer CSV-Datei und konvertiert sie in ein 2D-Array
function readAdjacencyMatrix(filePath) {
    const data = fs.readFileSync(filePath, "utf-8");
    const lines = data.trim().split("\n");
    const matrix = lines.map(line => line.split(",").map(Number));
    return matrix;
}

// Implementierung des Floyd-Warshall-Algorithmus zur Berechnung aller kürzesten Pfade
function floydWarshall(matrix) {
    const n = matrix.length;
    
    // Initialisiere Distanzmatrix: 0 für gleiche Knoten, Gewicht aus Matrix oder ∞ wenn keine Verbindung
    const dist = Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) =>
            i === j ? 0 : (matrix[i][j] !== 0 ? matrix[i][j] : Infinity)
        )
    );

    // Drei  Schleifen für den Floyd-Warshall-Algorithmus
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                // Prüft ob der Weg über k kürzer ist als der bisher bekannte Weg
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    return dist;
}

// Berechnet die Exzentrizität jedes Knotens (größte Entfernung zu anderen Knoten)
function calculateExcentricities(distances) {
    return distances.map(row =>
        Math.max(...row.map(val => val === Infinity ? 0 : val)) // Unverbundene Knoten als 0 behandeln
    );
}

// Führt die Analyse des Graphen durch und gibt Radius, Durchmesser und Zentrum aus
function analyzeGraph(filePath) {
    const matrix = readAdjacencyMatrix(filePath);              // Lese die Adjazenzmatrix
    const distances = floydWarshall(matrix);                   // Berechne kürzeste Pfade
    const excentricities = calculateExcentricities(distances); // Berechne Exzentrizitäten

    const radius = Math.min(...excentricities);                // Radius = kleinste Exzentrizität
    const diameter = Math.max(...excentricities);              // Durchmesser = größte Exzentrizität

    // Findet alle Knoten mit Exzentrizität = Radius → Zentrum des Graphen
    const center = excentricities
        .map((ex, i) => (ex === radius ? i : null))
        .filter(i => i !== null);

    // Ausgabe der Ergebnisse
    console.log("Exzentrizitäten:");
    excentricities.forEach((ex, i) => console.log(`Knoten ${i}: ${ex}`));

    console.log("\nRadius:", radius);
    console.log("Durchmesser:", diameter);
    console.log("Zentrum:", center.join(", "));
}

// Startet die Analyse mit der Datei "graph.csv"
analyzeGraph("graph.csv");
