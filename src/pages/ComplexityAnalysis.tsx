import { useState } from "react";

const complexityRows = [
  {
    process: "Build HashMaps",
    time: "O(N + I + P)",
    space: "O(N + I + P)",
    meaning:
      "Builds fast lookup structures from medicine, inventory, and pharmacy records.",
  },
  {
    process: "Build Trie Tree",
    time: "O(M)",
    space: "O(M)",
    meaning:
      "Inserts all medicine names into the Trie, where M is the total number of characters.",
  },
  {
    process: "Trie prefix search",
    time: "O(L)",
    space: "O(1) extra",
    meaning:
      "Follows the input characters through the Trie to find the prefix node.",
  },
  {
    process: "Autocomplete suggestions",
    time: "O(L + S)",
    space: "O(S)",
    meaning:
      "Finds the prefix node, then collects S matching suggestions.",
  },
  {
    process: "HashMap lookup",
    time: "O(1) average",
    space: "O(1) extra",
    meaning:
      "Retrieves medicine IDs, pharmacy IDs, and pharmacy details using keys.",
  },
  {
    process: "Damerau–Levenshtein",
    time: "O(a × b)",
    space: "O(a × b)",
    meaning:
      "Compares two strings and checks insertion, deletion, substitution, and transposition.",
  },
  {
    process: "Haversine computation",
    time: "O(R)",
    space: "O(1) per computation",
    meaning:
      "Computes distance for every matched pharmacy result.",
  },
  {
    process: "Quickselect",
    time: "O(R) average, O(R²) worst",
    space: "O(1) iterative",
    meaning:
      "Selects the top-k nearest pharmacies without fully sorting all results.",
  },
];

export function ComplexityAnalysis() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRow = complexityRows[activeIndex];

  return (
    <main className="page">
      <section className="section-heading">
        <p className="eyebrow">Performance</p>
        <h1>Complexity Analysis</h1>
        <p>
          Click a table row to view what that process means in the BotikaFinder
          workflow.
        </p>
      </section>

      <section className="complexity-layout">
        <div className="table-wrap">
          <table className="complexity-table">
            <thead>
              <tr>
                <th>Process</th>
                <th>Time Complexity</th>
                <th>Space Complexity</th>
              </tr>
            </thead>

            <tbody>
              {complexityRows.map((row, index) => (
                <tr
                  key={row.process}
                  className={activeIndex === index ? "active-row" : ""}
                  onClick={() => setActiveIndex(index)}
                >
                  <td>{row.process}</td>
                  <td>{row.time}</td>
                  <td>{row.space}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <article className="complexity-detail-card interactive-card">
          <span className="status-pill">Selected Process</span>
          <h2>{activeRow.process}</h2>
          <p>{activeRow.meaning}</p>

          <div className="algorithm-demo-grid">
            <div>
              <span>Time</span>
              <strong>{activeRow.time}</strong>
            </div>

            <div>
              <span>Space</span>
              <strong>{activeRow.space}</strong>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}