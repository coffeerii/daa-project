import { useEffect, useMemo, useState } from "react";
import {
  fetchInventory,
  fetchMedicines,
  fetchPharmacies,
} from "../services/botikaDataService";
import type {
  InventoryRecord,
  Medicine,
  Pharmacy,
  PharmacyResult,
  WorkflowStep,
} from "../types/models";
import { normalizeText } from "../algorithms/normalize";
import {
  buildMedicineNameToIdMap,
  buildMedicineToPharmaciesMap,
  buildPharmacyDetailsMap,
} from "../algorithms/hashmapBuilder";
import { buildTrie } from "../algorithms/trie";
import { findClosestMedicineName } from "../algorithms/damerauLevenshtein";
import { haversineDistanceKm } from "../algorithms/haversine";
import { quickselectTopK } from "../algorithms/quickselect";

type SearchMode = "medicine" | "pharmacy";

type SearchDemoProps = {
  initialQuery?: string;
  initialMode?: SearchMode;
  searchTrigger?: number;
};

const DEFAULT_USER_LOCATION = {
  latitude: 14.5995,
  longitude: 120.9842,
};

const medicineExamples = ["para", "met", "metropolol", "ibuprofen"];
const pharmacyExamples = ["Mercury", "Watsons", "Southstar", "Manila"];

export function SearchDemo({
  initialQuery = "",
  initialMode = "medicine",
  searchTrigger = 0,
}: SearchDemoProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);

  const [searchMode, setSearchMode] = useState<SearchMode>(initialMode);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [pharmacySuggestions, setPharmacySuggestions] = useState<Pharmacy[]>([]);
  const [correction, setCorrection] = useState<string | null>(null);
  const [results, setResults] = useState<PharmacyResult[]>([]);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [activeWorkflowIndex, setActiveWorkflowIndex] = useState<number | null>(
    null
  );
  const [expandedResultId, setExpandedResultId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    async function loadData() {
      try {
        const [medicineData, pharmacyData, inventoryData] = await Promise.all([
          fetchMedicines(),
          fetchPharmacies(),
          fetchInventory(),
        ]);

        setMedicines(medicineData);
        setPharmacies(pharmacyData);
        setInventory(inventoryData);
      } catch (error) {
        console.error("Failed to load BotikaFinder data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const structures = useMemo(() => {
    const medicineNames = medicines.map((medicine) => medicine.normalized_name);

    return {
      medicineNameToId: buildMedicineNameToIdMap(medicines),
      medicineToPharmacies: buildMedicineToPharmaciesMap(inventory),
      pharmacyDetails: buildPharmacyDetailsMap(pharmacies),
      trie: buildTrie(medicineNames),
      medicineNames,
    };
  }, [medicines, pharmacies, inventory]);

  useEffect(() => {
  if (loading || !initialQuery.trim()) {
    return;
  }

  setSearchMode(initialMode);

  const normalizedInitialQuery = normalizeText(initialQuery);
  setQuery(normalizedInitialQuery);

  if (initialMode === "medicine") {
    const trieSuggestions = structures.trie.searchPrefix(
      normalizedInitialQuery,
      5
    );

    setSuggestions(trieSuggestions);
    setPharmacySuggestions([]);

    if (trieSuggestions.length === 0) {
      const closest = findClosestMedicineName(
        normalizedInitialQuery,
        structures.medicineNames
      );

      setCorrection(closest);
    } else {
      setCorrection(null);
    }
  }
}, [loading, initialQuery, initialMode, searchTrigger, structures]);

  function resetSearchState() {
    setQuery("");
    setSuggestions([]);
    setPharmacySuggestions([]);
    setCorrection(null);
    setResults([]);
    setWorkflowSteps([]);
    setSelectedTarget(null);
    setActiveWorkflowIndex(null);
    setExpandedResultId(null);
  }

  function handleModeChange(mode: SearchMode) {
    setSearchMode(mode);
    resetSearchState();
  }

  function handleSearchInput(value: string) {
    setQuery(value);
    setSelectedTarget(null);
    setResults([]);
    setWorkflowSteps([]);
    setExpandedResultId(null);
    setActiveWorkflowIndex(null);

    const normalizedQuery = normalizeText(value);

    if (!normalizedQuery) {
      setSuggestions([]);
      setPharmacySuggestions([]);
      setCorrection(null);
      return;
    }

    if (searchMode === "medicine") {
      const trieSuggestions = structures.trie.searchPrefix(normalizedQuery, 5);
      setSuggestions(trieSuggestions);
      setPharmacySuggestions([]);

      if (trieSuggestions.length === 0) {
        const closest = findClosestMedicineName(
          normalizedQuery,
          structures.medicineNames
        );
        setCorrection(closest);
      } else {
        setCorrection(null);
      }

      return;
    }

    const matchedPharmacies = pharmacies
      .filter((pharmacy) => {
        const normalizedName = normalizeText(pharmacy.pharmacy_name);
        const normalizedAddress = normalizeText(pharmacy.address);

        return (
          normalizedName.includes(normalizedQuery) ||
          normalizedAddress.includes(normalizedQuery)
        );
      })
      .slice(0, 6);

    setPharmacySuggestions(matchedPharmacies);
    setSuggestions([]);
    setCorrection(null);
  }

  function useExample(value: string) {
    handleSearchInput(value);
  }

  function runMedicineSearch(selectedName: string) {
    const normalizedMedicine = normalizeText(selectedName);
    const medicineId = structures.medicineNameToId.get(normalizedMedicine);

    setQuery(normalizedMedicine);
    setSelectedTarget(normalizedMedicine);
    setSuggestions([]);
    setCorrection(null);
    setPharmacySuggestions([]);
    setExpandedResultId(null);

    if (!medicineId) {
      setResults([]);
      setWorkflowSteps([
        {
          title: "Medicine not found",
          value: "No matching medicine ID was found in the HashMap.",
        },
      ]);
      return;
    }

    const relatedInventoryRecords =
      structures.medicineToPharmacies.get(medicineId) ?? [];

    const pharmacyResults: PharmacyResult[] = relatedInventoryRecords
      .map((record) => {
        const pharmacy = structures.pharmacyDetails.get(record.pharmacy_id);

        if (!pharmacy) {
          return null;
        }

        const distanceKm = haversineDistanceKm(
          DEFAULT_USER_LOCATION.latitude,
          DEFAULT_USER_LOCATION.longitude,
          pharmacy.latitude,
          pharmacy.longitude
        );

        return {
          ...pharmacy,
          availability_status: record.availability_status,
          distanceKm,
        };
      })
      .filter((item): item is PharmacyResult => item !== null);

    const topResults = quickselectTopK<PharmacyResult>(
      pharmacyResults,
      3,
      (item: PharmacyResult) => item.distanceKm
    );

    setResults(topResults);

    const steps = [
      {
        title: "1. Data Preprocessing",
        value: `The input was cleaned and normalized into "${normalizedMedicine}".`,
      },
      {
        title: "2. Trie Tree Search",
        value:
          "The Trie Tree checked prefix-based medicine suggestions from the stored medicine names.",
      },
      {
        title: "3. HashMap: medicineNameToId",
        value: `${normalizedMedicine} → ${medicineId}`,
      },
      {
        title: "4. HashMap: medicineToPharmacies",
        value: `${medicineId} → [${relatedInventoryRecords
          .map((record) => record.pharmacy_id)
          .join(", ")}]`,
      },
      {
        title: "5. Haversine Formula",
        value:
          "The system computed distance from the default Manila City location to each matched pharmacy.",
      },
      {
        title: "6. Quickselect",
        value:
          "The system selected the top 3 nearest pharmacy results without fully sorting every pharmacy record.",
      },
    ];

    setWorkflowSteps(steps);
    setActiveWorkflowIndex(0);
  }

  function runPharmacySearch(selectedPharmacies?: Pharmacy[], label?: string) {
    const normalizedQuery = normalizeText(query);

    const matchedPharmacies =
      selectedPharmacies ??
      pharmacies.filter((pharmacy) => {
        const normalizedName = normalizeText(pharmacy.pharmacy_name);
        const normalizedAddress = normalizeText(pharmacy.address);

        if (!normalizedQuery) {
          return true;
        }

        return (
          normalizedName.includes(normalizedQuery) ||
          normalizedAddress.includes(normalizedQuery)
        );
      });

    const pharmacyResults: PharmacyResult[] = matchedPharmacies.map(
      (pharmacy) => {
        const distanceKm = haversineDistanceKm(
          DEFAULT_USER_LOCATION.latitude,
          DEFAULT_USER_LOCATION.longitude,
          pharmacy.latitude,
          pharmacy.longitude
        );

        return {
          ...pharmacy,
          availability_status: "Listed pharmacy",
          distanceKm,
        };
      }
    );

    const topResults = quickselectTopK<PharmacyResult>(
      pharmacyResults,
      3,
      (item: PharmacyResult) => item.distanceKm
    );

    setResults(topResults);
    setSelectedTarget(label ?? (normalizedQuery || "All pharmacies"));
    setSuggestions([]);
    setPharmacySuggestions([]);
    setCorrection(null);
    setExpandedResultId(null);

    const steps = [
      {
        title: "1. Data Preprocessing",
        value: `The pharmacy query was normalized into "${
          normalizedQuery || "all pharmacies"
        }".`,
      },
      {
        title: "2. Pharmacy Matching",
        value:
          "The system matched pharmacy names and addresses from the pharmacy records.",
      },
      {
        title: "3. Haversine Formula",
        value:
          "The distance from the default Manila City location to each matched pharmacy was computed.",
      },
      {
        title: "4. Quickselect",
        value:
          "The system selected the top 3 nearest matching pharmacies based on computed distance.",
      },
    ];

    setWorkflowSteps(steps);
    setActiveWorkflowIndex(0);
  }

  function runSelectedPharmacySearch(pharmacy: Pharmacy) {
    setQuery(pharmacy.pharmacy_name);
    runPharmacySearch([pharmacy], pharmacy.pharmacy_name);
  }

  function handleSearchSubmit() {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery && searchMode === "medicine") {
      setWorkflowSteps([
        {
          title: "Input required",
          value: "Please type a medicine name before searching.",
        },
      ]);
      return;
    }

    if (searchMode === "medicine") {
      if (structures.medicineNameToId.has(normalizedQuery)) {
        runMedicineSearch(normalizedQuery);
        return;
      }

      if (suggestions.length > 0) {
        runMedicineSearch(suggestions[0]);
        return;
      }

      if (correction) {
        runMedicineSearch(correction);
        return;
      }

      setWorkflowSteps([
        {
          title: "No medicine match",
          value:
            "No exact, prefix-based, or typo-correction match was found for the input.",
        },
      ]);
      setResults([]);
      return;
    }

    runPharmacySearch();
  }

  if (loading) {
    return (
      <main className="page">
        <section className="loading-card">
          <div className="loader"></div>
          <h1>Loading BotikaFinder</h1>
          <p>Preparing medicine, pharmacy, and inventory records...</p>
        </section>
      </main>
    );
  }

  const examples = searchMode === "medicine" ? medicineExamples : pharmacyExamples;

  return (
    <main className="page search-page">
      <section className="search-hero compact-section">
        <div>
          <p className="eyebrow">Find Pharmacy</p>
          <h1>Search medicines or pharmacies</h1>
          <p>
            Search by medicine name to find pharmacies that may list it, or
            search directly by pharmacy name or address.
          </p>
        </div>
      </section>

      <section className="search-card interactive-card">
        <div className="mode-toggle">
          <button
            type="button"
            className={searchMode === "medicine" ? "active" : ""}
            onClick={() => handleModeChange("medicine")}
          >
            Medicine Search
          </button>

          <button
            type="button"
            className={searchMode === "pharmacy" ? "active" : ""}
            onClick={() => handleModeChange("pharmacy")}
          >
            Pharmacy Search
          </button>
        </div>

        <div className="search-input-row">
          <div className="search-input-wrap">
            <span>⌕</span>
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(event) => handleSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearchSubmit();
                }
              }}
              placeholder={
                searchMode === "medicine"
                  ? "Try: para, met, metropolol, ibuprofen"
                  : "Try: Mercury, Watsons, Southstar, Manila"
              }
            />
          </div>

          <button
            type="button"
            className="search-action-button"
            onClick={handleSearchSubmit}
          >
            Search
          </button>

          <button type="button" className="clear-button" onClick={resetSearchState}>
            Clear
          </button>
        </div>

        <div className="quick-examples">
          <span>Try:</span>
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => useExample(example)}
            >
              {example}
            </button>
          ))}
        </div>

        <div className="helper-row">
          <span>
            {searchMode === "medicine"
              ? "Uses Trie, HashMap, Damerau–Levenshtein, Haversine, and Quickselect"
              : "Matches pharmacy names and addresses, then ranks by distance"}
          </span>
          <span>No real-time stock confirmation</span>
        </div>

        {searchMode === "medicine" && suggestions.length > 0 && (
          <div className="suggestion-panel">
            <h2>Trie Suggestions</h2>
            <p>Select the medicine you want to search.</p>

            <div className="chip-row">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => runMedicineSearch(suggestion)}
                  type="button"
                  className="suggestion-chip"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {searchMode === "pharmacy" && pharmacySuggestions.length > 0 && (
          <div className="suggestion-panel">
            <h2>Pharmacy Matches</h2>
            <p>Select a pharmacy or press Search to rank all matching results.</p>

            <div className="pharmacy-suggestion-grid">
              {pharmacySuggestions.map((pharmacy) => (
                <button
                  key={pharmacy.pharmacy_id}
                  type="button"
                  className="pharmacy-suggestion-card"
                  onClick={() => runSelectedPharmacySearch(pharmacy)}
                >
                  <strong>{pharmacy.pharmacy_name}</strong>
                  <span>{pharmacy.address}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {searchMode === "medicine" && correction && (
          <div className="correction-panel">
            <div>
              <h2>Possible typo detected</h2>
              <p>
                Did you mean <strong>{correction}</strong>?
              </p>
            </div>

            <button onClick={() => runMedicineSearch(correction)} type="button">
              Use suggestion
            </button>
          </div>
        )}

        {!query && (
          <div className="empty-state">
            <h2>
              {searchMode === "medicine"
                ? "Start by typing a medicine name"
                : "Start by typing a pharmacy name or location"}
            </h2>
            <p>
              {searchMode === "medicine"
                ? "Examples: para, met, metropolol, ibuprofen."
                : "Examples: Mercury, Watsons, Southstar, Manila."}
            </p>
          </div>
        )}
      </section>

      {selectedTarget && (
        <section className="selected-medicine-card interactive-card">
          <span>
            {searchMode === "medicine"
              ? "Selected medicine"
              : "Selected search"}
          </span>
          <strong>{selectedTarget}</strong>
        </section>
      )}

      {workflowSteps.length > 0 && (
        <section className="workflow-section">
          <div className="section-heading">
            <p className="eyebrow">Algorithm Workflow</p>
            <h2>How the result was produced</h2>
            <p>Click a workflow card to focus on a specific step.</p>
          </div>

          <div className="workflow-grid">
            {workflowSteps.map((step, index) => (
              <button
                key={step.title}
                type="button"
                className={`workflow-card interactive-card ${
                  activeWorkflowIndex === index ? "active-workflow" : ""
                }`}
                onClick={() => setActiveWorkflowIndex(index)}
              >
                <h3>{step.title}</h3>
                <p>{step.value}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {results.length > 0 && (
        <section className="results-section">
          <div className="section-heading">
            <p className="eyebrow">Nearest Results</p>
            <h2>Pharmacies to contact</h2>
            <p>
              This prototype does not provide real-time stock confirmation.
              Contact the pharmacy before visiting.
            </p>
          </div>

          <div className="results-list">
            {results.map((result, index) => {
              const isExpanded = expandedResultId === result.pharmacy_id;

              return (
                <article key={result.pharmacy_id} className="result-card">
                  <div className="result-rank">{index + 1}</div>

                  <div className="result-content">
                    <div className="result-header">
                      <h3>{result.pharmacy_name}</h3>
                      <span>{result.distanceKm.toFixed(2)} km</span>
                    </div>

                    <p>{result.address}</p>

                    <div className="result-meta">
                      <span>Status: {result.availability_status}</span>
                      <span>Contact: {result.contact ?? "Not provided"}</span>
                    </div>

                    {isExpanded && (
                      <div className="result-details">
                        <p>
                          This result is based on stored prototype records, not
                          live pharmacy inventory.
                        </p>
                        <p>
                          Coordinates: {result.latitude}, {result.longitude}
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      className="details-button"
                      onClick={() =>
                        setExpandedResultId(
                          isExpanded ? null : result.pharmacy_id
                        )
                      }
                    >
                      {isExpanded ? "Hide details" : "View details"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}