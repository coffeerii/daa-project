import { useState } from "react";
import { Home } from "./pages/Home";
import { SearchDemo } from "./pages/SearchDemo";
import { AlgorithmExplorer } from "./pages/AlgorithmExplorer";
import { ComplexityAnalysis } from "./pages/ComplexityAnalysis";
import { About } from "./pages/About";

type Page = "home" | "search" | "algorithms" | "complexity" | "about";
type SearchMode = "medicine" | "pharmacy";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [initialSearchQuery, setInitialSearchQuery] = useState("");
  const [initialSearchMode, setInitialSearchMode] =
    useState<SearchMode>("medicine");
  const [searchTrigger, setSearchTrigger] = useState(0);

  function handleHomeSearch(query: string) {
    setInitialSearchQuery(query);
    setInitialSearchMode("medicine");
    setSearchTrigger((previous) => previous + 1);
    setCurrentPage("search");
  }

  return (
    <div className="app-shell">
      <nav className="top-nav">
        <button
          type="button"
          className="brand-button"
          onClick={() => setCurrentPage("home")}
        >
          <span className="brand-icon">+</span>
          <span>BotikaFinder</span>
        </button>

        <div className="nav-links">
          <button
            type="button"
            className={currentPage === "home" ? "active" : ""}
            onClick={() => setCurrentPage("home")}
          >
            Home
          </button>

          <button
            type="button"
            className={currentPage === "search" ? "active" : ""}
            onClick={() => setCurrentPage("search")}
          >
            Find Pharmacy
          </button>

          <button
            type="button"
            className={currentPage === "algorithms" ? "active" : ""}
            onClick={() => setCurrentPage("algorithms")}
          >
            How it Works
          </button>

          <button
            type="button"
            className={currentPage === "complexity" ? "active" : ""}
            onClick={() => setCurrentPage("complexity")}
          >
            Complexity
          </button>

          <button
            type="button"
            className={currentPage === "about" ? "active" : ""}
            onClick={() => setCurrentPage("about")}
          >
            About
          </button>
        </div>

        <button
          type="button"
          className="login-button"
          onClick={() => setCurrentPage("search")}
        >
          Start Search
        </button>
      </nav>

      {currentPage === "home" && (
        <Home onNavigate={setCurrentPage} onHomeSearch={handleHomeSearch} />
      )}

      {currentPage === "search" && (
        <SearchDemo
          initialQuery={initialSearchQuery}
          initialMode={initialSearchMode}
          searchTrigger={searchTrigger}
        />
      )}

      {currentPage === "algorithms" && <AlgorithmExplorer />}
      {currentPage === "complexity" && <ComplexityAnalysis />}
      {currentPage === "about" && <About />}
    </div>
  );
}

export default App;