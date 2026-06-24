import type { PharmacyResult } from "../types/models";

type MapViewProps = {
  results?: PharmacyResult[];
};

export function MapView({ results = [] }: MapViewProps) {
  return (
    <section className="card">
      <h2>Map Preview</h2>
      <p>
        Map display will be added after the search and algorithm workflow are
        working.
      </p>

      {results.length > 0 && (
        <ul>
          {results.map((result) => (
            <li key={result.pharmacy_id}>
              {result.pharmacy_name}: {result.latitude}, {result.longitude}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}