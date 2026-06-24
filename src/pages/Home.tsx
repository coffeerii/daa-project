import { useState } from "react";

type Page = "home" | "search" | "algorithms" | "complexity" | "about";

type HomeProps = {
  onNavigate: (page: Page) => void;
  onHomeSearch: (query: string) => void;
};

export function Home({ onNavigate, onHomeSearch }: HomeProps) {
    const [homeMedicineSearch, setHomeMedicineSearch] = useState("");
const [homeLocationSearch, setHomeLocationSearch] = useState("Manila City");

function handleHomeSearch() {
  onHomeSearch(homeMedicineSearch);
}

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="trust-badge">
            <span className="badge-icon">✚</span>
            Algorithm-powered medicine search
          </div>

          <h1>
            Find listed medicines
            <br />
            near you <span>faster</span>
          </h1>

          <p>
            BotikaFinder helps users search medicine names, handle misspellings,
            and identify nearby pharmacies that may carry the selected medicine.
            The system demonstrates Trie Tree, HashMap, Damerau–Levenshtein
            Distance, Haversine Formula, and Quickselect in one workflow.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => onNavigate("search")}
            >
              Get Started <span>→</span>
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => onNavigate("algorithms")}
            >
              <span className="play-icon">▶ </span>
              How it works
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="medical-card">
            <div className="medical-card-header">
              <div>
                <p className="mini-label">Search Preview</p>
                <h2>Paracetamol</h2>
              </div>
              <span className="status-pill">Listed</span>
            </div>

            <div className="medicine-search-preview">
              <span>Trie suggestion</span>
              <strong>paracetamol</strong>
            </div>

            <div className="distance-card">
              <div>
                <span>Nearest pharmacy</span>
                <br />
                <strong>Mercury Drug</strong>
              </div>
              <p>0.00 km</p>
            </div>

            <div className="algorithm-stack">
              <span>Trie</span>
              <span>HashMap</span>
              <span>Damerau</span>
              <span>Haversine</span>
              <span>Quickselect</span>
            </div>
          </div>
        </div>
      </section>

      <section className="floating-search-panel">
  <div className="search-group">
    <span className="search-icon">⌕</span>

    <input
      className="home-search-input"
      type="text"
      value={homeMedicineSearch}
      onChange={(event) => setHomeMedicineSearch(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          handleHomeSearch();
        }
      }}
      placeholder="Search for Paracetamol, Metoprolol, Ibuprofen"
    />
  </div>

  <div className="search-divider"></div>

  <div className="search-group">
    <span className="location-icon">⌖</span>

    <input
      className="home-search-input"
      type="text"
      value={homeLocationSearch}
      onChange={(event) => setHomeLocationSearch(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          handleHomeSearch();
        }
      }}
      placeholder="Your city"
    />
  </div>

  <button
    type="button"
    className="search-button"
    onClick={handleHomeSearch}
    aria-label="Go to search demo"
  >
    ⌕
  </button>
</section>

      <section className="home-info-grid">
        <article className="info-card">
          <div className="info-icon">T</div>
          <h2>Autocomplete Search</h2>
          <p>
            Trie Tree supports prefix-based medicine suggestions while the user
            types partial medicine names.
          </p>
        </article>

        <article className="info-card">
          <div className="info-icon">#</div>
          <h2>Fast Retrieval</h2>
          <p>
            HashMaps retrieve medicine IDs, pharmacy IDs, and pharmacy details
            without repeatedly scanning all records.
          </p>
        </article>

        <article className="info-card">
          <div className="info-icon">⌖</div>
          <h2>Nearest Results</h2>
          <p>
            Haversine computes distance, while Quickselect chooses the nearest
            top-k pharmacy results efficiently.
          </p>
        </article>
      </section>
    </main>
  );
}