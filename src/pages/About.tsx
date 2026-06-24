import { useState } from "react";

const sections = [
  {
    title: "Project Scope",
    content:
      "BotikaFinder focuses on medicines typically sold in pharmacies and pharmacy branches with physical locations and online medicine or drug information.",
  },
  {
    title: "Medicine Search",
    content:
      "The medicine search demonstrates Trie autocomplete, HashMap retrieval, and Damerau–Levenshtein typo correction.",
  },
  {
    title: "Pharmacy Search",
    content:
      "The pharmacy search lets users search pharmacy names or addresses, then ranks matching pharmacies using Haversine distance and Quickselect.",
  },
  {
    title: "Limitations",
    content:
      "This prototype does not provide real-time medicine stock confirmation and does not provide optimized map routing.",
  },
];

export function About() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <main className="page">
      <section className="section-heading">
        <p className="eyebrow">Project Information</p>
        <h1>About BotikaFinder</h1>
        <p>
          Learn the purpose, scope, features, and limitations of the
          BotikaFinder prototype.
        </p>
      </section>

      <section className="accordion-list">
        {sections.map((section, index) => {
          const isOpen = openIndex === index;

          return (
            <article key={section.title} className="accordion-card">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span>{section.title}</span>
                <strong>{isOpen ? "−" : "+"}</strong>
              </button>

              {isOpen && <p>{section.content}</p>}
            </article>
          );
        })}
      </section>
    </main>
  );
}