import type { PharmacyResult } from "../types/models";

type PharmacyResultsProps = {
  results?: PharmacyResult[];
};

export function PharmacyResults({ results = [] }: PharmacyResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <section className="card">
      <h2>Nearest Pharmacy Results</h2>
      <p>
        This prototype does not provide real-time stock confirmation. Contact
        the pharmacy before visiting.
      </p>

      <div className="results-list">
        {results.map((result, index) => (
          <article key={result.pharmacy_id} className="result-card">
            <h3>
              {index + 1}. {result.pharmacy_name}
            </h3>
            <p>{result.address}</p>
            <p>Contact: {result.contact ?? "Not provided"}</p>
            <p>Status: {result.availability_status}</p>
            <p>Distance: {result.distanceKm.toFixed(2)} km</p>
          </article>
        ))}
      </div>
    </section>
  );
}