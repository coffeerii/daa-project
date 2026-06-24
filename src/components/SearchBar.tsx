type SearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export function SearchBar({ value = "", onChange }: SearchBarProps) {
  return (
    <div className="card">
      <label htmlFor="search-bar">Search medicine</label>
      <input
        id="search-bar"
        type="text"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder="Search for medicine"
      />
    </div>
  );
}
