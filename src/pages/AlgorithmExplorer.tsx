import { useState } from "react";

const algorithms = [
  {
    name: "Data Preprocessing",
    tag: "Input cleanup",
    purpose: "Cleans user input and stored data before algorithm processing.",
    input: "PARACETAMOL",
    output: "paracetamol",
    complexity: "O(L)",
    explanation:
      "The system trims spaces, converts text to lowercase, and standardizes user input before using the search algorithms.",
  },
  {
    name: "Trie Tree",
    tag: "Autocomplete",
    purpose: "Provides prefix-based medicine suggestions.",
    input: "met",
    output: "metformin, metoprolol",
    complexity: "O(L) for prefix search",
    explanation:
      "The Trie stores medicine names character by character, allowing the search bar to suggest possible medicine names while the user types.",
  },
  {
    name: "HashMap",
    tag: "Fast lookup",
    purpose: "Retrieves medicine IDs, pharmacy IDs, and pharmacy details.",
    input: 'medicineNameToId["metoprolol"]',
    output: "2",
    complexity: "O(1) average lookup",
    explanation:
      "HashMaps prevent repeated scanning by directly retrieving records using keys such as normalized medicine names and pharmacy IDs.",
  },
  {
    name: "Damerau–Levenshtein Distance",
    tag: "Typo correction",
    purpose: "Handles misspelled medicine names.",
    input: "metropolol",
    output: "metoprolol",
    complexity: "O(a × b)",
    explanation:
      "The algorithm compares the user input with stored medicine names using insertion, deletion, substitution, and transposition operations.",
  },
  {
    name: "Haversine Formula",
    tag: "Distance",
    purpose: "Computes user-to-pharmacy distance.",
    input: "User coordinates + pharmacy coordinates",
    output: "Distance in kilometers",
    complexity: "O(R)",
    explanation:
      "The formula estimates the distance between two latitude-longitude points on Earth.",
  },
  {
    name: "Quickselect",
    tag: "Top-k selection",
    purpose: "Selects nearest pharmacies without fully sorting all results.",
    input: "[0.8 km, 1.4 km, 2.1 km, 0.6 km]",
    output: "Top 3 nearest pharmacies",
    complexity: "O(R) average",
    explanation:
      "Quickselect partitions results by distance and focuses only on the part needed to obtain the top-k nearest pharmacies.",
  },
];

export function AlgorithmExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeAlgorithm = algorithms[activeIndex];

  return (
    <main className="page">
      <section className="section-heading">
        <p className="eyebrow">How It Works</p>
        <h1>Algorithm Explorer</h1>
        <p>
          Click an algorithm card to view its role, sample input, sample output,
          and complexity.
        </p>
      </section>

      <section className="algorithm-layout">
        <div className="algorithm-list">
          {algorithms.map((algorithm, index) => (
            <button
              key={algorithm.name}
              type="button"
              className={`algorithm-list-card ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <span>{algorithm.tag}</span>
              <strong>{algorithm.name}</strong>
            </button>
          ))}
        </div>

        <article className="algorithm-detail-card interactive-card">
          <span className="status-pill">{activeAlgorithm.tag}</span>
          <h2>{activeAlgorithm.name}</h2>
          <p>{activeAlgorithm.explanation}</p>

          <div className="algorithm-demo-grid">
            <div>
              <span>Sample input</span>
              <strong>{activeAlgorithm.input}</strong>
            </div>

            <div>
              <span>Sample output</span>
              <strong>{activeAlgorithm.output}</strong>
            </div>

            <div>
              <span>Complexity</span>
              <strong>{activeAlgorithm.complexity}</strong>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}